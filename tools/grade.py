# Hero city-night keeps the navy duotone.
# Lower-page photos (facade, skyline, equipment, team) export in natural color.
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
import os
OUT='public/img'
def hexrgb(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],dtype=np.float32)
def duotone(img, stops, contrast=1.0, gamma=1.0):
    a=np.asarray(img.convert('L'),dtype=np.float32)/255.
    a=np.clip((a-0.5)*contrast+0.5,0,1)**gamma
    pos=np.array([s[0] for s in stops]); cols=np.stack([hexrgb(s[1]) for s in stops])
    out=np.zeros(a.shape+(3,),dtype=np.float32)
    for c in range(3): out[...,c]=np.interp(a,pos,cols[:,c])
    return Image.fromarray(out.astype(np.uint8))
DEEP=[(0,'#000c17'),(0.5,'#002a48'),(0.85,'#0f6d9e'),(1,'#9fd6ee')]
def save(im,name,widths=(2400,1400,800),q=74):
    for w in widths:
        r=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS) if im.width>w else im
        r.save(f'{OUT}/{name}-{w}.webp','WEBP',quality=q,method=6)
S='src-img'
save(duotone(Image.open(f'{S}/px-15452183.jpg'),DEEP,contrast=1.25,gamma=1.1),'city-night')
save(Image.open(f'{S}/px-35528879.jpg').convert('RGB'),'facade-v')
save(Image.open(f'{S}/px-38633406.jpg').convert('RGB'),'skyline')
save(Image.open(f'{S}/px-36522027.jpg').convert('RGB'),'equipment')
for n in (1,2,3,4):
    im=Image.open(f'../uploads/versa-photo-{n}.jpg').convert('RGB')
    save(im,f'team-{n}g',widths=(2000,1200,700),q=76)
    save(im,f'team-{n}d',widths=(1400,800),q=74)
print('ok')
# hero v2: more contrast, luminous windows
HERO=[(0,'#000a14'),(0.35,'#00223d'),(0.62,'#0a4f80'),(0.85,'#3fa9dc'),(1,'#eaf7ff')]
save(duotone(Image.open(f'{S}/px-15452183.jpg'),HERO,contrast=1.5,gamma=1.0),'city-night')
