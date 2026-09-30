import numpy as np
from PIL import Image
im=Image.open('public/img/logo-src.png').convert('RGBA'); a=np.asarray(im).astype(np.int32)
r,g,b,al=a[...,0],a[...,1],a[...,2],a[...,3]
white=(r>225)&(g>225)&(b>225)
# navy version: white letters -> navy
n=a.copy(); n[white,0]=0; n[white,1]=0x34; n[white,2]=0x59
Image.fromarray(n.astype(np.uint8)).save('public/img/logo-navy.png')
im.save('public/img/logo-white.png')
# find V stripes bbox (colored, non-white pixels) on the left
col=(al>40)&(~white)
ys,xs=np.where(col); print('stripes bbox',xs.min(),xs.max(),ys.min(),ys.max())
# find columns fully empty to locate letter gaps
occ=(al>40).any(axis=0); gaps=[x for x in range(1,len(occ)) if occ[x]!=occ[x-1]]; print('transitions',gaps[:20])
