from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
import textwrap

def draw_wrapped_text(c, text, x, y, max_width, font, size, line_height):
    c.setFont(font, size)
    lines = textwrap.wrap(text, width=int(max_width / (size * 0.6)))  # Approx char width calculation
    for line in lines:
        c.drawString(x, y, line)
        y -= line_height
    return y

def draw_bullet_text(c, text, x, y, max_width, font, size, line_height):
    c.setFont(font, size)
    # Calculate width in characters approx
    char_width = size * 0.6
    # Bullet is drawn at x, text starts at x + 15 (approx indentation)
    text_width_pts = max_width - 15
    wrap_width_chars = int(text_width_pts / char_width)
    
    lines = textwrap.wrap(text, width=wrap_width_chars)
    
    # Draw bullet for first line
    c.setFont(font, 14) # Bullet size
    c.drawString(x, y, "•")
    
    c.setFont(font, size)
    for i, line in enumerate(lines):
        c.drawString(x + 15, y, line)
        y -= line_height
    
    return y

def create_resume_pdf(filename):
    c = canvas.Canvas(filename, pagesize=LETTER)
    width, height = LETTER
    
    # --- Colors ---
    header_bg_color = colors.HexColor("#5D7B89")  # Muted Teal/Blue
    right_col_bg_color = colors.HexColor("#F2F2F2") # Light Gray
    text_color = colors.HexColor("#333333")
    header_text_color = colors.white
    section_header_color = colors.HexColor("#808080")
    line_color = colors.HexColor("#555555")

    # --- Layout Geometry ---
    left_col_width = width * 0.38
    right_col_width = width - left_col_width
    header_height = height * 0.22
    
    # --- Backgrounds ---
    # Right Column Background
    c.setFillColor(right_col_bg_color)
    c.rect(left_col_width, 0, right_col_width, height - header_height, fill=1, stroke=0)
    
    # Header Background
    c.setFillColor(header_bg_color)
    c.rect(0, height - header_height, width, header_height, fill=1, stroke=0)

    # --- Header Content ---
    # Name
    c.setFillColor(header_text_color)
    c.setFont("Helvetica-Bold", 32)
    c.drawString(left_col_width + 0.2*inch, height - 1.4*inch, "TIMOTHY STUART")
    
    # Job Title
    c.setFont("Helvetica", 12)
    c.drawString(left_col_width + 0.25*inch, height - 1.7*inch, "MARKETING ASSISTANT")

    # Profile Picture Placeholder (Circle)
    circle_center_x = left_col_width * 0.65
    circle_center_y = height - (header_height / 2)
    circle_radius = 1.0 * inch
    
    # Draw circle border/fill
    c.setStrokeColor(colors.white)
    c.setFillColor(colors.lightgrey) # Placeholder color
    c.setLineWidth(3)
    c.circle(circle_center_x, circle_center_y, circle_radius, stroke=0, fill=1)
    # Note: In a real scenario, we would clip an image here. 
    # For now, I'll add text "PHOTO" inside
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(circle_center_x, circle_center_y, "PHOTO")

    # --- Left Column Content ---
    cursor_y = height - header_height - 0.8*inch
    left_margin = 0.5 * inch
    left_content_width = left_col_width - (1 * inch)

    # Function to draw section headers
    def draw_section_header(title, y_pos):
        c.setFillColor(section_header_color)
        c.setFont("Helvetica-Bold", 12)
        # Add slight character spacing simulation by appending spaces (crude but works for basic pdfs)
        spaced_title = " ".join(list(title)) 
        c.drawString(left_margin, y_pos, spaced_title)
        
        # Thick line below
        c.setStrokeColor(section_header_color)
        c.setLineWidth(3)
        c.line(left_margin, y_pos - 6, left_margin + 0.3*inch, y_pos - 6)
        c.setLineWidth(1)
        return y_pos - 0.4*inch

    # Personal Profile
    cursor_y = draw_section_header("PERSONAL PROFILE", cursor_y)
    profile_text = "Extremely motivated to constantly develop my skills and grow professionally. I am confident in my ability to come up with interesting ideas for unforgettable marketing campaigns."
    c.setFillColor(text_color)
    cursor_y = draw_wrapped_text(c, profile_text, left_margin, cursor_y, left_content_width, "Helvetica", 9, 12)

    # Contact
    cursor_y -= 0.6 * inch
    cursor_y = draw_section_header("CONTACT", cursor_y)
    
    contact_info = [
        ("512 Moore Street,", "Indigo Valley, San"),
        ("Diego, California", ""),
        ("timstuart@gmail.com", ""),
        ("872-871-9271", ""),
        ("/timstuart", "")
    ]
    
    c.setFont("Helvetica", 9)
    c.setFillColor(text_color)
    for item, sub in contact_info:
        c.drawString(left_margin + 0.2*inch, cursor_y, item)
        cursor_y -= 11
        if sub:
            c.drawString(left_margin + 0.2*inch, cursor_y, sub)
            cursor_y -= 11
        cursor_y -= 4 # Extra spacing between items

    # Education
    cursor_y -= 0.4 * inch
    cursor_y = draw_section_header("EDUCATION", cursor_y)
    
    c.setFont("Helvetica", 9)
    c.drawString(left_margin, cursor_y, "San Diego University")
    cursor_y -= 12
    c.drawString(left_margin, cursor_y, "Bachelor in Marketing, 2018")


    # --- Right Column Content ---
    cursor_y = height - header_height - 0.8*inch
    right_margin = left_col_width + 0.4*inch
    right_content_width = right_col_width - 0.8*inch

    def draw_right_header(title, y_pos):
        c.setFillColor(section_header_color)
        c.setFont("Helvetica-Bold", 12)
        spaced_title = " ".join(list(title))
        c.drawString(right_margin, y_pos, spaced_title)
        c.setStrokeColor(colors.lightgrey)
        c.setLineWidth(1)
        c.line(right_margin, y_pos - 6, right_margin + right_content_width, y_pos - 6)
        return y_pos - 0.4*inch

    # Skills
    cursor_y = draw_right_header("SKILLS", cursor_y)
    skills = [
        "Exceptional communication and networking skills",
        "Successful working in a team environment, as well as independently",
        "The ability to work under pressure and multi-task",
        "The ability to follow instructions and deliver quality results"
    ]
    
    c.setFillColor(text_color)
    for skill in skills:
        cursor_y = draw_bullet_text(c, skill, right_margin, cursor_y, right_content_width, "Helvetica", 10, 14)
        cursor_y -= 4

    # Work Experience
    cursor_y -= 0.4 * inch
    cursor_y = draw_right_header("WORK EXPERIENCE", cursor_y)

    # Job 1
    c.setFont("Helvetica-Bold", 10)
    c.drawString(right_margin, cursor_y, "Randelo & Co.,")
    c.setFont("Helvetica", 10)
    c.drawString(right_margin + 80, cursor_y, "Marketing Assistant")
    cursor_y -= 14
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.grey)
    c.drawString(right_margin, cursor_y, "JUN 2019 - JAN 2020")
    c.setFillColor(text_color)
    cursor_y -= 18
    
    job1_bullets = [
        "Maintained and organized numerous office files",
        "Constantly updated the company's contact and mailing lists",
        "Monitored ongoing marketing campaigns",
        "Monitored press coverage"
    ]
    for bullet in job1_bullets:
        cursor_y = draw_bullet_text(c, bullet, right_margin, cursor_y, right_content_width, "Helvetica", 10, 16)

    cursor_y -= 0.2 * inch

    # Job 2
    c.setFont("Helvetica-Bold", 10)
    c.drawString(right_margin, cursor_y, "World Mark,")
    c.setFont("Helvetica", 10)
    c.drawString(right_margin + 70, cursor_y, "Marketing Assistant")
    cursor_y -= 14
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.grey)
    c.drawString(right_margin, cursor_y, "JUN 2018 - JUN 2019")
    c.setFillColor(text_color)
    cursor_y -= 18
    
    job2_bullets = [
        "Handled the company's online presence - regularly updated the company's website and various social media accounts",
        "Monitored ongoing marketing campaigns",
        "Prepared presentations for prospective clients"
    ]
    for bullet in job2_bullets:
        cursor_y = draw_bullet_text(c, bullet, right_margin, cursor_y, right_content_width, "Helvetica", 10, 16)

    c.save()

create_resume_pdf("Timothy_Stuart_Resume.pdf")