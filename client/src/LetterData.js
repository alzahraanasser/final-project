import imgAlef from './Images/Alef.png';
import imgBa from './Images/Ba.png';
import imgTa from './Images/Ta.png';
import imgTha from './Images/Tha.png';
import imgJeem from './Images/Jeem.png';
import imgHaa from './Images/Haa.png';
import imgKhaa from './Images/Khaa.png';
import imgDal from './Images/Dal.png';
import imgThal from './Images/Thal.png';
import imgRa from './Images/Ra.png';

import traceAlef from './Images/tAlef.jpg';
import traceBa from './Images/tBa.jpg';
import traceTa from './Images/tTa.jpg';
import traceTha from './Images/tTha.jpg';
import traceJeem from './Images/tJeem.jpg';
import traceHaa from './Images/tHaa.jpg';
import traceKhaa from './Images/tKhaa.jpg';
import traceDal from './Images/tDal.jpg';
import traceThal from './Images/tThal.jpg';
import traceRa from './Images/tRa.jpg';


const LetterData = [
  { id: 1, image: imgAlef, image2: traceAlef, title: "الألف", letter: "أ", harakatAudio: "أ.mp3", activityLetter: "أ", description: "أ مثل أسد، أب، أرض", text: ["أَ", "أُ", "إِ"], correctText: "أَ" },
  { id: 2, image: imgBa, image2: traceBa, title: "الباء", letter: "ب", harakatAudio: "ب.mp3", activityLetter: "ب", description: "ب مثل باب، بطة، بيت", text: ["بَ", "بُ", "بِ"], correctText: "ب" },
  { id: 3, image: imgTa, image2: traceTa, title: "التاء", letter: "ت", harakatAudio: "ت.mp3", activityLetter: "ت", description: "ت مثل تفاح، تمر، تاج", text: ["تَ", "تُ", "تِ"], correctText: "ت" },
  { id: 4, image: imgTha, image2: traceTha, title: "الثاء", letter: "ث", harakatAudio: "ث.mp3", activityLetter: "ث", description: "ث مثل ثعلب، ثوب، ثقافة", text: ["ثَ", "ثُ", "ثِ"], correctText: "ث" },
  { id: 5, image: imgJeem, image2: traceJeem, title: "الجيم", letter: "ج", harakatAudio: "ج.mp3", activityLetter: "ج", description: "ج مثل جمل، جبل، جزيرة", text: ["جَ", "جُ", "جِ"], correctText: "ج" },
  { id: 6, image: imgHaa, image2: traceHaa, title: "الحاء", letter: "ح", harakatAudio: "ح.mp3", activityLetter: "ح", description: "ح مثل حصان، حوت، حب", text: ["حَ", "حُ", "حِ"], correctText: "ح" },
  { id: 7, image: imgKhaa, image2: traceKhaa, title: "الخاء", letter: "خ", harakatAudio: "خ.mp3", activityLetter: "خ", description: "خ مثل خبز، خروف، خيال", text: ["خَ", "خُ", "خِ"], correctText: "خ" },
  { id: 8, image: imgDal, image2: traceDal, title: "الدال", letter: "د", harakatAudio: "د.mp3", activityLetter: "د", description: "د مثل دجاجة، دفتر، دواء", text: ["دَ", "دُ", "دِ"], correctText: "د" },
  { id: 9, image: imgThal, image2: traceThal, title: "الذال", letter: "ذ", harakatAudio: "ذ.mp3", activityLetter: "ذ", description: "ذ مثل ذهب، ذكرى، ذراع", text: ["ذَ", "ذُ", "ذِ"], correctText: "ذ" },
  { id: 10, image: imgRa, image2: traceRa, title: "الراء", letter: "ر", harakatAudio: "ر.mp3", activityLetter: "ر", description: "ر مثل رجل، رسام، ريحان", text: ["رَ", "رُ", "رِ"], correctText: "ر" },
];

export default LetterData;
