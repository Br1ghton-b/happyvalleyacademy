import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

await mkdir('public/downloads', { recursive: true });
await mkdir('outputs/flyer', { recursive: true });
const path = 'public/downloads/Happy-Valley-Academy-Course-Flyer.pdf';
const doc = new PDFDocument({size:'A4',margin:0,info:{Title:'Happy Valley Academy - Course Guide',Author:'Happy Valley Academy',Subject:'Care courses, fees and registration enquiries'}});
const stream = createWriteStream(path);
doc.pipe(stream);
doc.registerFont('serif','C:/Windows/Fonts/georgia.ttf');
doc.registerFont('serifItalic','C:/Windows/Fonts/georgiai.ttf');
doc.registerFont('sans','C:/Windows/Fonts/arial.ttf');
doc.registerFont('bold','C:/Windows/Fonts/arialbd.ttf');
const purple='#432660', green='#2d6747', ink='#2c2235', muted='#69626d', cream='#fbf9f5';
const text=(value,x,y,size=10,color=ink,font='sans',width=523,extra={})=>doc.font(font).fontSize(size).fillColor(color).text(value,x,y,{width,lineGap:3,...extra});
const rule=(y,color='#ddd6dc')=>doc.moveTo(36,y).lineTo(559,y).lineWidth(.6).strokeColor(color).stroke();
doc.rect(0,0,595.28,841.89).fill(cream);
doc.rect(0,0,595.28,9).fill(purple);
const logo=await sharp('public/images/logo.webp').png().toBuffer();
doc.image(logo,36,25,{width:132});
text('LEARN TODAY.',350,47,10,purple,'bold',209,{align:'right',characterSpacing:1.3});
text('CARE TOMORROW.',350,65,10,green,'bold',209,{align:'right',characterSpacing:1.3});
text('PROFESSIONAL CARE TRAINING',350,88,7,muted,'sans',209,{align:'right',characterSpacing:1});
rule(121);

text('YOUR NEXT CHAPTER',36,147,8,green,'bold',295,{characterSpacing:1.8});
text('Your future\nin care',36,174,35,purple,'serif',310,{lineGap:0});
text('starts here.',36,260,32,green,'serifItalic',310);
text('Gain valuable skills. Build your future.\nExplore a meaningful path in elderly care,\nfirst aid or baby care.',36,309,10,muted,'sans',295,{lineGap:5});
doc.save().rect(354,145,205,251).clip().image('../IMG-20260916-WA0032.jpg',354,145,{cover:[205,251],align:'center',valign:'center'}).restore();

doc.roundedRect(36,374,290,43,3).fill('#eaf0e5');
text('3 MONTHS',48,383,11,green,'bold',88);
text('Theory + practicals',145,382,9,green,'bold',168);
text('We arrange placements for practicals.',145,397,7,green,'sans',172);

text('CHOOSE YOUR COURSE',36,445,8,green,'bold',523,{characterSpacing:1.6});
const cards=[['01','Elderly\nCare','R2,500','R3,000'],['02','First Aid\nLevel 101','R1,700','R2,200'],['03','Baby Care /\nNanny','R1,000','R1,500']];
cards.forEach(([n,title,fee,total],i)=>{const x=36+i*179;doc.roundedRect(x,468,165,113,3).lineWidth(.6).fillAndStroke('#fffefa','#ded8dd');text(n,x+13,481,8,green,'bold',140);text(title,x+13,499,15,purple,'serif',140,{lineGap:1});text(fee,x+13,539,21,purple,'serif',140);text('Total incl. registration: '+total,x+13,568,7.5,muted,'sans',140);});
text('Add R500 registration to each course or the package.',36,595,10,purple,'bold',523);

doc.roundedRect(36,621,523,66,3).fill(green);
text('THE COMPLETE CARE PACKAGE',51,634,7,'#dce5cc','bold',330,{characterSpacing:1});
text('All three courses',51,652,21,'#ffffff','serif',330);
text('R4,000',392,633,28,'#ffffff','serif',151,{align:'right'});
text('R4,500 including registration',359,672,8,'#ffffff','sans',184,{align:'right'});

doc.save().rect(36,708,82,91).clip().image('../IMG-20260916-WA0034.jpg',36,708,{cover:[82,102],align:'center',valign:'center'}).restore();
text('LET’S GET YOU STARTED',135,710,8,green,'bold',424,{characterSpacing:1.4});
text('Call or WhatsApp  061 117 3163',135,730,12,purple,'bold',424,{link:'https://wa.me/27611173163'});
text('083 992 9153  |  081 673 6289',135,751,10,ink,'sans',424);
text('happyvalleyacademy@outlook.com',135,772,10,purple,'sans',424,{link:'mailto:happyvalleyacademy@outlook.com'});
rule(808);
text('Contact us to confirm intake dates, entry requirements and course arrangements.',36,816,7,muted,'sans',523);
doc.end();
await new Promise((resolve,reject)=>{stream.on('finish',resolve);stream.on('error',reject);});

const pdf=await getDocument({data:new Uint8Array(await readFile(path)),useSystemFonts:true}).promise;
if(pdf.numPages!==1)throw new Error('Expected a one-page flyer, found '+pdf.numPages);
const page=await pdf.getPage(1);
const viewport=page.getViewport({scale:2});
const canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));
await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
await writeFile('outputs/flyer/preview.png',canvas.toBuffer('image/png'));
const extracted=(await page.getTextContent()).items.map(i=>i.str).join(' ');
for(const required of ['happyvalleyacademy@outlook.com','R2,500','R1,700','R1,000','R4,000','R500','R3,000','R2,200','R1,500','R4,500','061 117 3163','083 992 9153','081 673 6289'])if(!extracted.includes(required))throw new Error('Missing flyer content: '+required);
console.log('Created and rendered one-page PDF. All course prices and contact details verified.');
