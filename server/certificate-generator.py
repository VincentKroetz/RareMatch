#!/usr/bin/env python3
import json
import sys
import os
from PIL import Image, ImageDraw, ImageFont
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from io import BytesIO

def generate_certificate_and_poster(data):
    try:
        # Parse input data
        certificate_data = json.loads(data)
        
        
# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)
        cert_id = certificate_data['id']
        first_name = certificate_data['firstName']
        last_name = certificate_data['lastName']
        full_name = f"{first_name} {last_name}"
        eye_color = certificate_data.get('eyeColor')
        hair_color = certificate_data.get('hairColor')
        facial_features = certificate_data.get('facialFeatures', [])
        physical_abilities = certificate_data.get('physicalAbilities', [])
        rarity_percentage = certificate_data['rarityPercentage']
        rarity_ratio = certificate_data['rarityRatio']
        
        # Generate certificate
        certificate_path = generate_certificate(
            output_dir, cert_id, full_name, eye_color, hair_color, 
            facial_features, physical_abilities, rarity_percentage, rarity_ratio
        )
        
        # Generate poster
        poster_path = generate_poster(
            output_dir, cert_id, full_name, eye_color, hair_color,
            facial_features, physical_abilities, rarity_percentage, rarity_ratio
        )
        
        # Return paths as JSON
        result = {
            "certificatePath": certificate_path,
            "posterPath": poster_path
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

def generate_certificate(output_dir, cert_id, full_name, eye_color, hair_color, facial_features, physical_abilities, rarity_percentage, rarity_ratio):
    # Certificate dimensions
    width, height = 800, 600
    
    # Create certificate background
    certificate = Image.new('RGB', (width, height), color=(255, 252, 240))  # Warm cream background
    draw = ImageDraw.Draw(certificate)
    
    # Try to load fonts, fall back to default if not available
    try:
        title_font = ImageFont.truetype("DejaVuSans-Bold.ttf", 32)
        name_font = ImageFont.truetype("DejaVuSans-Bold.ttf", 28)
        body_font = ImageFont.truetype("DejaVuSans.ttf", 18)
        small_font = ImageFont.truetype("DejaVuSans.ttf", 14)
    except:
        try:
            title_font = ImageFont.load_default()
            name_font = ImageFont.load_default()
            body_font = ImageFont.load_default()
            small_font = ImageFont.load_default()
        except:
            title_font = None
            name_font = None
            body_font = None
            small_font = None
    
    # Draw decorative border
    draw.rectangle([(15, 15), (width-15, height-15)], outline="#F59E0B", width=6)
    draw.rectangle([(25, 25), (width-25, height-25)], outline="#6366F1", width=2)
    
    # Title
    draw.text((width//2, 60), "SELTENHEITS-ZERTIFIKAT", fill="#1F2937", font=title_font, anchor="mm")
    
    # Decorative line under title
    draw.rectangle([(width//2 - 80, 80), (width//2 + 80, 85)], fill="#F59E0B")
    
    # Main text
    draw.text((width//2, 120), "Hiermit wird bestätigt, dass", fill="#4B5563", font=body_font, anchor="mm")
    
    # Name (highlighted)
    draw.text((width//2, 160), full_name.upper(), fill="#6366F1", font=name_font, anchor="mm")
    
    # Description
    draw.text((width//2, 200), "eine außergewöhnlich seltene Merkmalskombination besitzt:", fill="#4B5563", font=body_font, anchor="mm")
    
    # Build traits list
    traits_list = []
    trait_names = {
        # Eye colors
        "brown": "Braune Augen", "blue": "Blaue Augen", "green": "Grüne Augen", "hazel": "Haselnussbraune Augen",
        # Hair colors
        "black": "Schwarze Haare", "brown": "Braune Haare", "blonde": "Blonde Haare", "red": "Rote Haare",
        # Facial features
        "freckles": "Sommersprossen", "dimples": "Grübchen", "cleft_chin": "Kinngrübchen", "high_cheekbones": "Hohe Wangenknochen",
        # Physical abilities
        "rollTongueWave": "Zunge wellenförmig rollen", "independentEye": "Auge unabhängig bewegen",
        "wiggleEarsNoHands": "Ohren ohne Hände wackeln", "tongueToElbow": "Ellbogen mit Zunge berühren",
        "thumbHypermobility": "Daumen hyperflexibel", "tongueCloverleaf": "Zunge wie Kleeblatt formen",
        "independentToes": "Zehen unabhängig bewegen"
    }
    
    # Add eye and hair color
    if eye_color:
        traits_list.append(f"• {trait_names.get(eye_color, eye_color.title())}")
    if hair_color:
        traits_list.append(f"• {trait_names.get(hair_color, hair_color.title())}")
    
    # Add facial features
    for feature in facial_features:
        if feature in trait_names:
            traits_list.append(f"• {trait_names[feature]}")
    
    # Add physical abilities
    for ability in physical_abilities:
        if ability in trait_names:
            traits_list.append(f"• {trait_names[ability]}")
    
    # Draw traits
    y_pos = 240
    for trait in traits_list:
        draw.text((width//2, y_pos), trait, fill="#374151", font=small_font, anchor="mm")
        y_pos += 25
    
    # Rarity box
    box_y = y_pos + 20
    draw.rectangle([(width//2 - 120, box_y), (width//2 + 120, box_y + 80)], fill="#FEF3C7", outline="#F59E0B", width=2)
    
    # Rarity text
    draw.text((width//2, box_y + 20), "Geschätzte globale Seltenheit:", fill="#92400E", font=small_font, anchor="mm")
    draw.text((width//2, box_y + 40), f"{rarity_percentage:.6f}%", fill="#7C2D12", font=name_font, anchor="mm")
    draw.text((width//2, box_y + 60), f"({rarity_ratio} Menschen)", fill="#92400E", font=small_font, anchor="mm")
    
    # Footer
    draw.text((width//2, height - 40), "Sie sind offiziell eine 'Limitierte Auflage' - einzigartig und ultra-selten!", 
              fill="#6366F1", font=body_font, anchor="mm")
    
    # Save certificate
    certificate_filename = f"certificate_{cert_id}.png"
    certificate_path = os.path.join(output_dir, certificate_filename)
    certificate.save(certificate_path)
    
    return f"generated/{certificate_filename}"

def generate_poster(output_dir, cert_id, full_name, eye_color, hair_color, facial_features, physical_abilities, rarity_percentage, rarity_ratio):
    # Create poster using matplotlib
    fig, ax = plt.subplots(figsize=(10, 12))
    ax.set_facecolor('#F8FAFC')
    
    # Remove axes
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    
    # Title
    ax.text(0.5, 0.95, f"{full_name.upper()}", fontsize=28, weight='bold', ha='center', 
            color='#1F2937', transform=ax.transAxes)
    ax.text(0.5, 0.90, f"{rarity_ratio} Menschen weltweit", fontsize=18, ha='center',
            color='#6366F1', transform=ax.transAxes)
    
    # Main rarity display
    circle = plt.Circle((0.5, 0.7), 0.15, color='#F59E0B', alpha=0.2, transform=ax.transAxes)
    ax.add_artist(circle)
    
    ax.text(0.5, 0.72, "ULTRA SELTEN", fontsize=16, weight='bold', ha='center',
            color='#7C2D12', transform=ax.transAxes)
    ax.text(0.5, 0.68, f"{rarity_percentage:.6f}%", fontsize=24, weight='bold', ha='center',
            color='#B91C1C', transform=ax.transAxes)
    
    # Traits section
    ax.text(0.5, 0.55, "SELTENE KOMBINATION:", fontsize=14, weight='bold', ha='center',
            color='#374151', transform=ax.transAxes)
    
    # Build traits text
    trait_names = {
        # Eye colors
        "brown": "Braune Augen", "blue": "Blaue Augen", "green": "Grüne Augen", "hazel": "Haselnussbraune Augen",
        # Hair colors
        "black": "Schwarze Haare", "brown": "Braune Haare", "blonde": "Blonde Haare", "red": "Rote Haare",
        # Facial features
        "freckles": "Sommersprossen", "dimples": "Grübchen", "cleft_chin": "Kinngrübchen", "high_cheekbones": "Hohe Wangenknochen",
        # Physical abilities
        "rollTongueWave": "Zunge wellenförmig rollen", "independentEye": "Auge unabhängig bewegen",
        "wiggleEarsNoHands": "Ohren ohne Hände wackeln", "tongueToElbow": "Ellbogen mit Zunge berühren",
        "thumbHypermobility": "Daumen hyperflexibel", "tongueCloverleaf": "Zunge wie Kleeblatt formen",
        "independentToes": "Zehen unabhängig bewegen"
    }
    
    traits_text = []
    if eye_color:
        traits_text.append(f"• {trait_names.get(eye_color, eye_color.title())}")
    if hair_color:
        traits_text.append(f"• {trait_names.get(hair_color, hair_color.title())}")
    
    for feature in facial_features:
        if feature in trait_names:
            traits_text.append(f"• {trait_names[feature]}")
    
    for ability in physical_abilities:
        if ability in trait_names:
            traits_text.append(f"• {trait_names[ability]}")
    
    # Display traits
    y_pos = 0.45
    for trait in traits_text:
        ax.text(0.5, y_pos, trait, fontsize=12, ha='center', color='#4B5563', transform=ax.transAxes)
        y_pos -= 0.04
    
    # Bottom section
    ax.text(0.5, 0.15, "CERTIFIED LIMITED EDITION", fontsize=16, weight='bold', ha='center',
            color='#6366F1', transform=ax.transAxes)
    ax.text(0.5, 0.10, "Rarity Certificate Generator", fontsize=10, ha='center',
            color='#9CA3AF', transform=ax.transAxes)
    
    # Add decorative elements
    rect = patches.Rectangle((0.1, 0.05), 0.8, 0.9, linewidth=3, edgecolor='#F59E0B', 
                           facecolor='none', transform=ax.transAxes)
    ax.add_patch(rect)
    
    # Save poster
    poster_filename = f"poster_{cert_id}.png"
    poster_path = os.path.join(output_dir, poster_filename)
    plt.savefig(poster_path, dpi=300, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    
    return f"generated/{poster_filename}"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python certificate-generator.py <json_data>", file=sys.stderr)
        sys.exit(1)
    
    generate_certificate_and_poster(sys.argv[1])
