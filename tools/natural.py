# Natural colour exports (no navy duotone, no grade). Client asked on 2026-10-02 to remove the blue overlay on images.
from PIL import Image
OUT='public/img'
def save(im,name,widths=(2400,1400,800),q=78):
    im=im.convert('RGB')
    for w in widths:
        r=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS) if im.width>w else im
        r.save(f'{OUT}/{name}-{w}.webp','WEBP',quality=q,method=6)
S='src-img'
save(Image.open(f'{S}/px-33122153.jpg'),'hero-equipement')
save(Image.open(f'{S}/px-15452183.jpg'),'city-night')
save(Image.open(f'{S}/px-35528879.jpg'),'facade-v')
save(Image.open(f'{S}/px-38633406.jpg'),'skyline')
save(Image.open(f'{S}/px-36522027.jpg'),'equipment')
for n in (1,2,3,4):
    im=Image.open(f'../uploads/versa-photo-{n}.jpg')
    save(im,f'team-{n}g',widths=(2000,1200,700),q=78)
    save(im,f'team-{n}d',widths=(1400,800),q=76)
print('ok')
