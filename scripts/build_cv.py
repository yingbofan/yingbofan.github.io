#!/usr/bin/env python3
"""Build a compact, maintainable academic CV from content/site.json."""

import json
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


ROOT = Path(__file__).resolve().parents[1]


def normalize_ascii_dashes(value):
    if isinstance(value, str):
        return value.replace("–", "-").replace("—", "-").replace("·", "-")
    if isinstance(value, list):
        return [normalize_ascii_dashes(item) for item in value]
    if isinstance(value, dict):
        return {key: normalize_ascii_dashes(item) for key, item in value.items()}
    return value


DATA = normalize_ascii_dashes(json.loads((ROOT / "content/site.json").read_text(encoding="utf-8")))
OUTPUT = ROOT / "public/assets/yingbo-fan-cv.pdf"

ENGLISH_TITLES = {
    "高级智能化煤矿建设发展思考": "Reflections on the Development of Advanced Intelligent Coal Mines",
    "基于视觉信息对处理成果的多维码智能解析方法和系统": "Intelligent Multidimensional-Code Parsing Method and System for Visual-Information Processing Results",
    "一种地理空间到高精度数字空间的设备管控系统": "Equipment Control System from Geographic Space to High-Precision Digital Space",
    "一种通用人工时空智能大模型的构建方法": "Method for Constructing a General Artificial Spatiotemporal Intelligence Foundation Model",
    "基于可变形网格和宽度残差网络的图像矩形化方法和装置": "Image Rectangling Method and Apparatus Based on Deformable Meshes and Wide Residual Networks",
    "受限空间内矢量空间搭建与图像融合建模的方法和装置": "Method and Apparatus for Vector-Space Construction and Image-Fusion Modeling in Confined Spaces",
    "一种基于时空信息对的人工智能系统": "Artificial Intelligence System Based on Spatiotemporal Information Pairs",
    "一种面向受限空间的多视角几何场景建立方法和装置": "Multi-View Geometric Scene Construction Method and Apparatus for Confined Spaces",
    "一种真实地理空间场景实时构建方法和实时构建装置": "Method and Apparatus for Real-Time Construction of Real Geographic-Space Scenes",
    "基于多重特征描述符的图像特征匹配方法和装置": "Image Feature Matching Method and Apparatus Based on Multiple Feature Descriptors",
    "一种基于Adaboost算法的人脸检测方法": "Face Detection Method Based on the AdaBoost Algorithm",
    "一种基于幂指数量化的深度神经网络硬件加速器": "Deep Neural Network Hardware Accelerator Based on Power-of-Two Quantization",
}

INK = colors.HexColor("#15191f")
MUTED = colors.HexColor("#626973")
ACCENT = colors.HexColor("#1f5b83")
LINE = colors.HexColor("#d8dce0")

regular_font = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
bold_font = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
pdfmetrics.registerFont(TTFont("CVSans", regular_font))
pdfmetrics.registerFont(TTFont("CVSans-Bold", bold_font))


class CVDocTemplate(BaseDocTemplate):
    pass


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(18 * mm, 13 * mm, A4[0] - 18 * mm, 13 * mm)
    canvas.setFont("CVSans", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 8.5 * mm, "Yingbo Fan - Academic CV - September 2026")
    canvas.drawRightString(A4[0] - 18 * mm, 8.5 * mm, str(doc.page))
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="Name", fontName="CVSans-Bold", fontSize=25, leading=29,
    textColor=INK, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="Role", fontName="CVSans", fontSize=10.5, leading=15,
    textColor=ACCENT, spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="Contact", fontName="CVSans", fontSize=8.2, leading=12,
    textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="Section", fontName="CVSans-Bold", fontSize=13.5, leading=17,
    textColor=INK, spaceBefore=10, spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="BodyCV", fontName="CVSans", fontSize=8.5, leading=12.5,
    textColor=INK, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="Small", fontName="CVSans", fontSize=7.6, leading=11,
    textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="EntryTitle", fontName="CVSans-Bold", fontSize=8.8, leading=12.2,
    textColor=INK, spaceAfter=2,
))
styles.add(ParagraphStyle(
    name="CompactEntry", fontName="CVSans", fontSize=7.7, leading=10.2,
    textColor=INK, spaceAfter=0,
))
styles.add(ParagraphStyle(
    name="RightSmall", parent=styles["Small"], alignment=TA_RIGHT,
))


def p(text, style="BodyCV"):
    return Paragraph(text, styles[style])


def section(title):
    return [p(escape(title), "Section"), HRFlowable(width="100%", thickness=0.6, color=ACCENT, spaceAfter=6)]


def dated_entry(period, title, subtitle="", detail="", bottom_pad=5, content_style="BodyCV"):
    right = f"<b>{escape(title)}</b>"
    if subtitle:
        right += f"<br/><font color='#626973'>{escape(subtitle)}</font>"
    if detail:
        right += f"<br/>{escape(detail)}"
    table = Table(
        [[p(escape(str(period)), "Small"), p(right, content_style)]],
        colWidths=[31 * mm, 139 * mm],
        hAlign="LEFT",
    )
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), bottom_pad),
    ]))
    return table


def publication_entry(item):
    authors = escape(item["authors"]).replace("Yingbo Fan", "<b>Yingbo Fan</b>")
    doi = f" - DOI: {escape(item['doi'])}" if item.get("doi") else ""
    title = ENGLISH_TITLES.get(item["title"], item["title"])
    body = (
        f"<b>{escape(title)}</b><br/>"
        f"{authors}<br/>"
        f"<font color='#1f5b83'>{escape(item['venue'])}{doi}</font>"
    )
    return KeepTogether([p(body, "BodyCV"), Spacer(1, 2)])


def patent_entry(item):
    title = ENGLISH_TITLES.get(item["title"], item["title"])
    return dated_entry(item["year"], title, f"{item['country']} - {item['number']}", bottom_pad=1, content_style="CompactEntry")


doc = CVDocTemplate(
    str(OUTPUT), pagesize=A4,
    leftMargin=18 * mm, rightMargin=18 * mm,
    topMargin=16 * mm, bottomMargin=18 * mm,
    title="Yingbo Fan - Academic CV",
    author="Yingbo Fan",
    subject="Multimodal Spatial Intelligence, World Models, and Intelligent Mining",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates(PageTemplate(id="cv", frames=[frame], onPage=footer))

site = DATA["site"]
story = [
    p(escape(site["name"]), "Name"),
    p(f"{escape(site['title'])} - {escape(site['affiliation'])}", "Role"),
    p(
        f"{escape(site['email'])}  -  {escape(site['location'])}  -  "
        "github.com/yingbofan  -  orcid.org/0009-0009-9276-9549",
        "Contact",
    ),
    Spacer(1, 7),
]

story += section("Research Profile")
story += [
    p(escape(site["mission"])),
    p("<b>Research interests:</b> " + " - ".join(escape(x) for x in site["keywords"])),
]

story += section("Academic Record")
stats = []
for item in DATA["stats"]:
    stats.append(p(f"<font color='#1f5b83' size='15'><b>{escape(item['value'])}</b></font><br/><b>{escape(item['label'])}</b><br/><font color='#626973'>{escape(item['detail'])}</font>", "Small"))
stat_table = Table([stats], colWidths=[42.5 * mm] * 4)
stat_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BOX", (0, 0), (-1, -1), 0.5, LINE),
    ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
    ("LEFTPADDING", (0, 0), (-1, -1), 7),
    ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ("TOPPADDING", (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
]))
story += [stat_table]

story += section("Current Research")
for item in DATA["featured"]:
    points = " - ".join(item.get("highlights", []))
    story.append(dated_entry(item["status"], item["title"], item.get("subtitle", ""), points))

story += section("Experience")
for item in DATA["experience"]:
    story.append(dated_entry(item["period"], item["role"], item["institution"]))

story += section("Education")
for item in DATA["education"]:
    story.append(dated_entry(item["period"], item["degree"], item["institution"]))

publication_entries = [publication_entry(item) for item in DATA["publications"]]
story.append(KeepTogether(section("Publications") + [publication_entries[0]]))
story.extend(publication_entries[1:])

story += section("Selected Major Research Programs")
for item in DATA["projects"]:
    story.append(dated_entry(item["period"], item["title"], f"{item['program']} - {item['role']}", item["description"]))

story += section("Awards")
for item in DATA["awards"]:
    story.append(dated_entry(item.get("year") or "Selected", item["title"]))

story += section("Granted Patents")
for item in DATA["patents"]:
    story.append(patent_entry(item))

doc.build(story)
print(f"Built {OUTPUT}")
