# backend/app/routes/analytics.py
# NEW FILE — adds GET /analytics/summary and GET /analytics/export
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from app.utils.security import get_current_user
from app.services.analytics_service import (
    get_analytics_summary_from_db,
    get_transactions_for_pdf,
)
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io

router = APIRouter(tags=["Analytics"])


@router.get("/summary")
def get_analytics_summary(
    period: str = Query(default="monthly", pattern="^(daily|weekly|monthly)$"),
    current_user: dict = Depends(get_current_user),
):
    """
    Returns chart_data (bar/line), pie_data, and summary totals
    for the logged-in user, pulled from the existing transactions table.
    """
    user_id = current_user["user_id"]
    return get_analytics_summary_from_db(user_id, period)


@router.get("/export")
def export_analytics_pdf(
    current_user: dict = Depends(get_current_user),
):
    """
    Generates a styled PDF analytics report and returns it as a
    downloadable attachment.
    """
    user_id = current_user["user_id"]
    data = get_transactions_for_pdf(user_id)
    transactions = data["transactions"]
    summary = data["summary"]

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    DARK_BLUE = colors.HexColor("#0A1128")
    MID_BLUE  = colors.HexColor("#2563eb")
    LIGHT_BLUE = colors.HexColor("#eff6ff")

    title_style = ParagraphStyle(
        "Title", parent=styles["Title"],
        fontSize=22, textColor=DARK_BLUE, spaceAfter=4,
        alignment=TA_CENTER, fontName="Helvetica-Bold",
    )
    subtitle_style = ParagraphStyle(
        "Subtitle", parent=styles["Normal"],
        fontSize=10, textColor=colors.HexColor("#64748b"),
        alignment=TA_CENTER, spaceAfter=20,
    )
    section_style = ParagraphStyle(
        "Section", parent=styles["Normal"],
        fontSize=13, textColor=DARK_BLUE,
        fontName="Helvetica-Bold", spaceBefore=16, spaceAfter=8,
    )
    normal = styles["Normal"]

    elements = []

    # ── Header ──────────────────────────────────────────────────────────────
    elements.append(Paragraph("BudgetMate", title_style))
    elements.append(Paragraph(
        f"Analytics Report  ·  Generated {datetime.now().strftime('%B %d, %Y')}",
        subtitle_style,
    ))

    # ── Summary Cards row ────────────────────────────────────────────────────
    elements.append(Paragraph("Summary", section_style))

    summary_data = [
        ["Total Income", "Total Expenses", "Net Savings"],
        [
            f"${summary.get('total_income', 0):,.2f}",
            f"${summary.get('total_expense', 0):,.2f}",
            f"${summary.get('net_savings', 0):,.2f}",
        ],
    ]
    summary_table = Table(summary_data, colWidths=[5.5 * cm, 5.5 * cm, 5.5 * cm])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND",  (0, 0), (-1, 0), DARK_BLUE),
        ("TEXTCOLOR",   (0, 0), (-1, 0), colors.white),
        ("FONTNAME",    (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, 0), 9),
        ("ALIGN",       (0, 0), (-1, -1), "CENTER"),
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        ("FONTNAME",    (0, 1), (-1, 1), "Helvetica-Bold"),
        ("FONTSIZE",    (0, 1), (-1, 1), 14),
        ("TEXTCOLOR",   (0, 1), (0, 1),  colors.HexColor("#16a34a")),  # income green
        ("TEXTCOLOR",   (1, 1), (1, 1),  colors.HexColor("#dc2626")),  # expense red
        ("TEXTCOLOR",   (2, 1), (2, 1),  MID_BLUE),
        ("BACKGROUND",  (0, 1), (-1, 1), LIGHT_BLUE),
        ("ROWBACKGROUNDS", (0, 1), (-1, 1), [LIGHT_BLUE]),
        ("GRID",        (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ("ROUNDEDCORNERS", [4]),
        ("TOPPADDING",  (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 14))

    # ── Transactions Table ──────────────────────────────────────────────────
    elements.append(Paragraph("Transaction History", section_style))

    if not transactions:
        elements.append(Paragraph("No transactions found.", normal))
    else:
        header = ["#", "Date", "Title", "Category", "Type", "Amount"]
        rows = [header]
        for i, tx in enumerate(transactions, 1):
            rows.append([
                str(i),
                tx["date"],
                tx["title"][:30],
                tx["category"],
                tx["type"],
                f"${tx['amount']:,.2f}",
            ])

        col_widths = [1 * cm, 2.5 * cm, 5 * cm, 3.5 * cm, 2.5 * cm, 2.5 * cm]
        tx_table = Table(rows, colWidths=col_widths, repeatRows=1)

        row_bg = []
        for idx in range(1, len(rows)):
            bg = colors.white if idx % 2 == 0 else colors.HexColor("#f8faff")
            row_bg.append(("BACKGROUND", (0, idx), (-1, idx), bg))

        tx_table.setStyle(TableStyle([
            # Header
            ("BACKGROUND",   (0, 0), (-1, 0), DARK_BLUE),
            ("TEXTCOLOR",    (0, 0), (-1, 0), colors.white),
            ("FONTNAME",     (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE",     (0, 0), (-1, 0), 8),
            ("ALIGN",        (0, 0), (-1, 0), "CENTER"),
            # Data rows
            ("FONTSIZE",     (0, 1), (-1, -1), 8),
            ("FONTNAME",     (0, 1), (-1, -1), "Helvetica"),
            ("ALIGN",        (5, 1), (5, -1), "RIGHT"),   # amount right-aligned
            ("ALIGN",        (0, 1), (1, -1), "CENTER"),  # # and date centered
            ("GRID",         (0, 0), (-1, -1), 0.3, colors.HexColor("#e2e8f0")),
            ("TOPPADDING",   (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING",(0, 0), (-1, -1), 6),
            ("LEFTPADDING",  (0, 0), (-1, -1), 5),
            *row_bg,
        ]))

        elements.append(tx_table)

    # ── Footer note ─────────────────────────────────────────────────────────
    elements.append(Spacer(1, 20))
    footer_style = ParagraphStyle(
        "Footer", parent=styles["Normal"],
        fontSize=7, textColor=colors.HexColor("#94a3b8"), alignment=TA_CENTER,
    )
    elements.append(Paragraph(
        "This report was generated automatically by BudgetMate. "
        "All amounts are in USD.",
        footer_style,
    ))

    doc.build(elements)
    buffer.seek(0)

    filename = f"budgetmate_report_{datetime.now().strftime('%Y%m%d')}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )