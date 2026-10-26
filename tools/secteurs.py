# Révision v2 (2026-10-20): photos des secteurs (légères, 4:3) et carte Versa Équipements. Sources dans CREDITS.md.
from PIL import Image
OUT='public/img'; S='src-img'
def crop(im,ratio,fx=.5,fy=.5):
    w,h=im.size
    if w/h>ratio: nw=round(h*ratio); x=round((w-nw)*fx); return im.crop((x,0,x+nw,h))
    nh=round(w/ratio); y=round((h-nh)*fy); return im.crop((0,y,w,y+nh))
def save(src,name,widths,ratio,q=72,fx=.5,fy=.5):
    im=crop(Image.open(f'{S}/{src}').convert('RGB'),ratio,fx,fy)
    for w in widths:
        r=im.resize((w,round(w/ratio)),Image.LANCZOS)
        r.save(f'{OUT}/{name}-{w}.webp','WEBP',quality=q,method=6)
SECT=[('px-33321431.jpg','secteur-construction-chargeuse',.5,.5),('px-2253413.jpg','secteur-agriculture-tracteur',.5,.5),
 ('px-12278582.jpg','secteur-foresterie-chargeuse-billots',.55,.5),('px-13176450.jpg','secteur-medical-irm',.5,.22),
 ('px-27099095.jpg','secteur-transport-camion',.5,.5),('px-17229385.jpg','secteur-manutention-chariot-elevateur',.5,.5),
 ('px-28704740.jpg','secteur-restauration-cuisine',.5,.6)]
for src,name,fx,fy in SECT: save(src,name,(1000,600),4/3,fx=fx,fy=fy)
save('px-36465273.jpg','versa-equipements-excavatrices',(1400,800),16/10,q=74)
print('ok')
