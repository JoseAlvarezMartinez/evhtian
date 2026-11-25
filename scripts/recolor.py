import numpy as np, cv2, sys, glob, os
# Uso: python recolor.py <modelo: essential|terra> <carpeta de salida>
MODEL=sys.argv[1]
SRC=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','brand','fotos',f'{MODEL}-bordo','')
EXP=0.85
K={'rosa':0.62,'negro':1.0,'marino':0.75,'verde':0.62}
TARGETS={'rosa':'B98175','negro':'111115','marino':'303B57','verde':'7A8150'}
BOXES_BY_MODEL={'essential':{1:[(275,280,11,13),(362,670,28,16)],2:[(982,585,17,24),(671,1154,37,17)],3:[(464,679,37,18)],4:[(1002,576,23,28),(556,1147,42,23)]},
  'terra':{1:[],2:[],3:[(992,572,24,28)],4:[(1026,572,33,33)]}}
BOXES=BOXES_BY_MODEL[MODEL]
# Objetos que no son tela (lapiceras): adentro solo se recolorea lo que es claramente tela bordó.
PROTECT={'essential':{},'terra':{3:[(722,496,52,68)],4:[(810,498,31,59),(842,503,26,61)]}}[MODEL]
# 'dark': la etiqueta es el parche negro (con el logo dorado adentro). 'auto': detección general (Essential).
LABEL_MODE={'essential':'auto','terra':'dark'}[MODEL]
# Borde contra la piel: separa la mezcla bordó+piel y la reemplaza por color nuevo+piel.
UNMIX={'essential':False,'terra':True}[MODEL]
def s2l(x): x=x/255.0; return np.where(x<=0.04045,x/12.92,((x+0.055)/1.055)**2.4)
def l2s(x): x=np.clip(x,0,1); return np.where(x<=0.0031308,x*12.92,1.055*x**(1/2.4)-0.055)*255
E=lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(r,r))
def run(i,out):
    im=cv2.imread(glob.glob(f'{SRC}{i}.*')[0]); H,W_=im.shape[:2]
    hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV).astype(int); h,s,v=hsv[...,0],hsv[...,1],hsv[...,2]
    wineh=(h>=160)
    m=(wineh&(s>70)&(v<200)).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,E(5))
    n,lab,st,_=cv2.connectedComponentsWithStats(m); keep=np.zeros_like(m)
    for k in range(1,n):
        if st[k,cv2.CC_STAT_AREA]>0.004*m.size: keep[lab==k]=1
    m=cv2.morphologyEx(keep,cv2.MORPH_CLOSE,E(7))
    neutral=((v<70)&(s<110))|((h>=12)&(h<=35)&(s>50)&(v>70))
    m[neutral&(keep==0)]=0
    m[(keep==0)&(h>=3)&(h<=30)]=0
    box=np.zeros((H,W_),np.uint8)
    for (x,y,w,hh) in BOXES[i]: box[y-5:y+hh+5,x-5:x+w+5]=1
    # inside label boxes: garment = wine pixels + label itself (label pasted back later)
    if LABEL_MODE=='auto':
        m[(box>0)&(cv2.dilate(m,E(15))>0)]=1
        m[(box>0)&~(wineh&(s>40))&(cv2.dilate(keep,E(3))==0)&~neutral]=0
    else:
        dk=np.zeros((H,W_),np.uint8)
        for (x,y,w,hh) in BOXES[i]:
            sub=np.zeros_like(dk); sub[y-3:y+hh+3,x-3:x+w+3]=(v<75)[y-3:y+hh+3,x-3:x+w+3]
            n,lab,st,_=cv2.connectedComponentsWithStats(sub)
            if n>1:
                comp=(lab==1+np.argmax(st[1:,cv2.CC_STAT_AREA])).astype(np.uint8)
                cn,_=cv2.findContours(comp,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
                dk|=cv2.drawContours(np.zeros_like(dk),[max(cn,key=cv2.contourArea)],-1,1,-1)
        dk=cv2.dilate(dk,np.ones((3,3),np.uint8))
        m[(box>0)&(cv2.dilate(m,E(9))>0)&(dk==0)&wineh]=1
        m[dk>0]=0
    # faint wine fringe ring outside the mask joins it
    weak=((h>=160)&(s>40)&(v<225)).astype(np.uint8)
    m=m|(cv2.dilate(m,E(3))&weak)
    if UNMIX:
        # sombra de contacto tela/brazo (bordó muy oscuro, tono 0-8): es tela en sombra
        cs=((v<80)&(s>120)&((h<=8)|(h>=165))).astype(np.uint8)
        m=m|(cv2.dilate(m,E(5))&cs)
    er=cv2.erode(m,E(7))*(1-cv2.dilate(box,E(7)))
    lin=s2l(im[...,::-1].astype(np.float64)); Y=lin@np.array([0.2126,0.7152,0.0722])
    Ym=np.median(Y[er>0]); sm=Y/Ym
    lo,hi=np.percentile(sm[er>0],[0.5,99.5]); sm=np.clip(sm,lo,hi)
    fill=(((cv2.dilate(m,E(5))>0)&(cv2.erode(m,E(5))==0))|(cv2.dilate(box,E(5))>0)).astype(np.uint8)
    ef=er.astype(np.float32)
    num=cv2.GaussianBlur((sm*ef).astype(np.float32),(0,0),4); den=cv2.GaussianBlur(ef,(0,0),4)
    num2=cv2.GaussianBlur((sm*ef).astype(np.float32),(0,0),12); den2=cv2.GaussianBlur(ef,(0,0),12)
    sb=np.where(den>0.05,num/np.maximum(den,1e-6),num2/np.maximum(den2,1e-6))
    # keep real detail where pixel is clearly garment, smooth estimate only where mixed
    sm=np.where(fill>0,np.minimum(sm,sb),sm)
    a=cv2.GaussianBlur(cv2.dilate(m,E(5)).astype(np.float32),(0,0),1.0)
    hs=np.where(h>=90,h-180,h).astype(np.float32)
    ah=np.clip((1.5-hs)/5.0,0,1)*np.clip((s-25)/60.0,0,1)
    ah=cv2.GaussianBlur(ah.astype(np.float32),(0,0),0.8)
    core=cv2.GaussianBlur(cv2.erode(m,E(5)).astype(np.float32),(0,0),1.0)
    a=np.maximum(core,a*ah)[...,None]
    pr=np.zeros((H,W_),np.float32)
    for (x,y,w,hh) in PROTECT.get(i,[]): pr[y:y+hh,x:x+w]=1
    pr=cv2.GaussianBlur(pr,(0,0),1.5)
    wineness=np.clip((s-110)/50.0,0,1)*wineh
    a=a*(1-pr[...,None]*(1-wineness[...,None]))
    if UNMIX:
        mm=cv2.dilate(m,E(3)); band=((cv2.dilate(m,E(9))>0)&(cv2.erode(m,E(3))==0)).astype(np.float32)
        cf=cv2.erode(m,E(9)).astype(np.float32); bf=(cv2.dilate(m,E(11))==0).astype(np.float32)
        nb=lambda w,sg: np.stack([cv2.GaussianBlur((lin[...,c]*w).astype(np.float32),(0,0),sg) for c in range(3)],-1)/np.maximum(cv2.GaussianBlur(w,(0,0),sg),1e-4)[...,None]
        fg=nb(cf,5); bg=nb(bf,5)
        d=fg-bg; al=np.clip(((lin-bg)*d).sum(-1)/np.maximum((d*d).sum(-1),1e-6),0,1)
        reddish=((h>=165)|(h<=4))&(s>50)
        skinbg=(bg[...,0]-bg[...,2])/np.maximum(bg[...,0],1e-4)>0.3
        al=al*band*reddish*skinbg*(cv2.GaussianBlur(bf,(0,0),5)>0.05)*(cv2.GaussianBlur(cf,(0,0),5)>0.05)
        al=cv2.GaussianBlur(al.astype(np.float32),(0,0),0.6)
    else:
        al=None
    if LABEL_MODE=='dark':
        lm=cv2.GaussianBlur(dk.astype(np.float32),(0,0),0.7)[...,None]
    # label matte inside boxes: 1 where not wine fabric
    vr=np.zeros((H,W_),np.float32)
    for (x,y,w,hh) in (BOXES[i] if LABEL_MODE=='auto' else []):
        x0,y0,x1,y1=x-5,y-5,x+w+5,y+hh+5
        R=np.zeros((H,W_),bool); R[y0-6:y1+6,x0-6:x1+6]=True; R[y0:y1,x0:x1]=False
        sel=R&wineh&(s>70); vr[y0:y1,x0:x1]=np.median(v[sel]) if sel.any() else 80
    vr=np.maximum(vr,1)
    wn=np.clip((s-60)/70.0,0,1)*wineh*np.clip((v-0.5*vr)/(0.3*vr),0,1)
    raw=(1-wn).astype(np.float32)*box
    core=(raw>0.5).astype(np.uint8); keepc=np.zeros_like(core)
    for (x,y,w,hh) in BOXES[i]:
        sub=np.zeros_like(core); sub[y-5:y+hh+5,x-5:x+w+5]=core[y-5:y+hh+5,x-5:x+w+5]
        n,lab,st,_=cv2.connectedComponentsWithStats(sub)
        if n>1: keepc[lab==1+np.argmax(st[1:,cv2.CC_STAT_AREA])]=1
    # fill holes (gold letters) and trim the dark-red outline by 1px
    cnts,_=cv2.findContours(keepc,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE); filled=np.zeros_like(keepc)
    for c in cnts:
        op=cv2.morphologyEx(cv2.drawContours(np.zeros_like(keepc),[c],-1,1,-1),cv2.MORPH_OPEN,np.ones((5,5)))
        cc,_=cv2.findContours(op,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
        if cc:
            c2=max(cc,key=cv2.contourArea); box4=np.int32(cv2.boxPoints(cv2.minAreaRect(c2)))
            filled|=(cv2.fillPoly(np.zeros_like(keepc),[box4],1)&cv2.dilate(op,np.ones((3,3))))
    keepc=cv2.erode(filled,np.ones((3,3)))
    if LABEL_MODE=='auto': lm=cv2.GaussianBlur(keepc.astype(np.float32),(0,0),0.7)[...,None]
    for name,hx in TARGETS.items():
        T=s2l(np.array([int(hx[j:j+2],16) for j in (0,2,4)],float))*K[name]
        new=T*(sm**EXP)[...,None]
        o=new*a+lin*(1-a)
        if al is not None:
            # alfa máxima que no deja canales negativos (evita puntitos grises)
            Amax=np.min(lin/np.maximum(fg,1e-5),axis=-1,keepdims=True)
            A=np.minimum(al[...,None],Amax); un=new*A+(lin-A*fg)
            wgt=np.clip((A-a)*5,0,1)
            o=un*wgt+o*(1-wgt)
        # lapiceras: el borde que refleja bordó pasa a gris (son negras/plateadas)
        pg=(pr*(1-wineness)*((((h>=150)|(h<=8))&(s>30)) ))[...,None]*(1-a)
        o=o*(1-pg)+np.repeat(Y[...,None],3,2)*pg
        red=(((h>=150)|(h<=8))&(s>40))[...,None]
        ll=np.where(red,np.repeat(Y[...,None],3,2)*0.9,lin)
        o=ll*lm+o*(1-lm)
        cv2.imwrite(f'{out}/{i}-{name}.png',np.round(l2s(o)[...,::-1]).astype(np.uint8))
    cv2.imwrite(f'{out}/mask{i}.png',m*255)
os.makedirs(sys.argv[2],exist_ok=True)
for i in range(1,5): run(i,sys.argv[2])
