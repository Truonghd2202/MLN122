import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Bookmark, ChevronDown, List, Maximize2, Minimize2, X } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import { bookMeta, pages, references } from './data/book.js';
import './style.css';

const featurePages = ['IX', 'X', 'XI', 'XII', 'XIII'].map(roman => pages.findIndex(page => page.roman === roman));

const pageSummaries = {
  concept:'Kết hợp quy luật thị trường với mục tiêu phát triển vì con người.',
  branches:'Ba cơ sở: xu hướng khách quan, động lực sản xuất và mục tiêu của nhân dân.',
  'feature-index':'Năm đặc trưng cùng tạo nên định hướng của mô hình.',
  feature:'Phát triển kinh tế để nâng cao đời sống và mở rộng cơ hội cho mọi người.',
  ownership:'Đa dạng thành phần kinh tế, phát huy vai trò của từng khu vực.',
  management:'Thị trường vận hành; Nhà nước quản lý; Đảng định hướng.',
  distribution:'Kết hợp thu nhập theo đóng góp với phúc lợi xã hội.',
  cycle:'Tăng trưởng và tiến bộ xã hội cần hỗ trợ lẫn nhau.',
  achievements:'Những chuyển biến tích cực qua nhiều phương diện phát triển.',
  challenges:'Tập trung vào năng suất, thể chế, cơ hội và môi trường.',
  roadmap:'Hoàn thiện thể chế, nâng năng suất và phát triển bền vững.'
};
const pageContexts = {
  concept:'Cung – cầu, giá cả và cạnh tranh giúp phân bổ nguồn lực. Nhà nước định hướng để phát triển phục vụ mục tiêu xã hội.',
  branches:'Ba cơ sở tạo thành một lập luận: mô hình phù hợp xu thế, phát huy sức sản xuất và hướng tới đời sống nhân dân.',
  V:'Phân công lao động và trao đổi khiến thị trường trở thành cơ chế phổ biến. Việt Nam vận dụng cơ chế ấy theo điều kiện lịch sử và mục tiêu riêng.',
  VI:'Giá cả truyền tín hiệu, cạnh tranh khuyến khích đổi mới và hiệu quả. Hội nhập mở thêm cơ hội tiếp cận thị trường, công nghệ và phương thức quản trị; đồng thời đòi hỏi năng lực cạnh tranh, nhân lực phù hợp và sức chống chịu trước biến động bên ngoài. Thể chế giúp hạn chế hệ quả tiêu cực, gắn tăng trưởng với lợi ích xã hội.',
  VII:'Tăng trưởng tạo nguồn lực cho việc làm, giáo dục và y tế. Tiến bộ xã hội cũng nâng chất lượng và độ bền vững của phát triển.',
  'feature-index':'Năm đặc trưng liên kết thành cách tổ chức và điều tiết nền kinh tế. Chọn một mục để mở phần phân tích tương ứng.',
  feature:'Mục tiêu không dừng ở tăng sản lượng. Cần xem phát triển cải thiện cơ hội và chất lượng sống của người dân ra sao.',
  ownership:'Nhiều hình thức sở hữu và thành phần kinh tế giúp huy động nguồn lực, kinh nghiệm và sáng kiến đa dạng. Các chủ thể cùng sản xuất, hợp tác và cạnh tranh theo pháp luật; hoàn thiện thể chế giúp kết nối hoạt động riêng lẻ với mục tiêu phát triển chung.',
  management:'Ba vai trò bổ trợ nhau, không thay thế nhau. Thị trường vận hành; Nhà nước quản lý bằng pháp luật; Đảng định hướng mục tiêu.',
  distribution:'Thu nhập theo lao động và hiệu quả tạo động lực làm việc. Phúc lợi xã hội hỗ trợ người dân tiếp cận dịch vụ thiết yếu.',
  cycle:'Phát triển kinh tế không chỉ hướng tới gia tăng sản lượng mà còn cần cải thiện chất lượng cuộc sống. Cơ hội học tập, chăm sóc sức khỏe và an sinh nâng năng lực con người; nguồn nhân lực khỏe mạnh, có tri thức lại hỗ trợ tăng trưởng dài hạn. Tiến bộ và công bằng xã hội vì thế cần được tính đến trong từng bước phát triển.',
  achievements:'Có thể nhận diện chuyển biến qua sản xuất, cơ cấu kinh tế, hạ tầng và hội nhập. Thương mại, đầu tư và liên kết sản xuất quốc tế giúp mở rộng cơ hội tiếp cận thị trường, công nghệ và phương thức quản trị. Những hình ảnh bên dưới chỉ minh họa chủ đề, không đại diện cho địa điểm hay sự kiện cụ thể; nhận định định lượng cần đối chiếu nguồn thống kê theo năm.',
  challenges:'Bên cạnh kết quả phát triển, sức ép môi trường, chênh lệch điều kiện sống và khác biệt cơ hội tiếp cận nguồn lực vẫn đặt ra yêu cầu điều tiết. Các vấn đề liên quan lẫn nhau và ảnh hưởng đến chất lượng tăng trưởng. Hình ảnh là minh họa khái quát, không phải bằng chứng thống kê.',
  roadmap:'Các hướng hoàn thiện phản hồi trực tiếp những thách thức ở trang trước. Nâng cao chất lượng giáo dục, đào tạo và ứng dụng khoa học – công nghệ giúp người lao động thích ứng với chuyển dịch sản xuất, còn thể chế và chính sách công cần kết nối cơ hội phát triển với mục tiêu bền vững. Chọn từng bước để xem hành động cụ thể.'
};
const achievementNotes = [
  'Quy mô sản xuất và dịch vụ được mở rộng.',
  'Năng lực sản xuất và cơ cấu ngành chuyển dịch.',
  'Nhiều khu vực tham gia đầu tư, kinh doanh.',
  'Kết nối thương mại với thị trường quốc tế sâu hơn.',
  'Thu nhập và khả năng tiếp cận dịch vụ được cải thiện.',
  'Hạ tầng, giáo dục, y tế và an sinh tiếp tục được đầu tư.'
];
const argumentDetails = {
  V:{
    title:'TỪ SẢN XUẤT ĐẾN TRAO ĐỔI',
    points:[['Chuyên môn hóa','Người sản xuất tập trung vào ngành nghề phù hợp năng lực.'],['Phân công lao động','Mỗi chủ thể làm một phần, tạo nhu cầu trao đổi.'],['Mở rộng thị trường','Hàng hóa kết nối nơi sản xuất với người có nhu cầu.']],
    example:'Ví dụ: một cơ sở sản xuất cần quan sát nhu cầu, chọn đầu vào và tìm đối tác để đưa hàng hóa ra thị trường.'
  },
  VI:{
    title:'CƠ CHẾ TẠO ĐỘNG LỰC',
    points:[['Giá cả','Báo hiệu nhu cầu và mức độ khan hiếm.'],['Cạnh tranh','Khuyến khích giảm chi phí, nâng chất lượng.'],['Đổi mới','Thúc đẩy công nghệ và năng suất lao động.']],
    example:'Ví dụ: doanh nghiệp cải tiến quy trình để giảm chi phí, giữ khách hàng và cạnh tranh tốt hơn.'
  },
  VII:{
    title:'TĂNG TRƯỞNG ĐI VÀO ĐỜI SỐNG',
    points:[['Việc làm','Mở rộng sản xuất tạo thêm việc làm và thu nhập.'],['Dịch vụ công','Nguồn lực hỗ trợ giáo dục, y tế và an sinh.'],['Cơ hội','Người dân có điều kiện tham gia và phát triển năng lực.']],
    example:'Khi đánh giá chính sách, hãy nhìn cả tăng trưởng lẫn việc làm, thu nhập và khả năng tiếp cận dịch vụ.'
  }
};
const challengeNotes = [
  'Năng suất thấp làm chậm tăng thu nhập và sức cạnh tranh.',
  'Thực thi thiếu đồng bộ làm tăng chi phí kinh doanh.',
  'Khác biệt vùng miền làm lệch cơ hội và dịch vụ.',
  'Sức ép môi trường tạo chi phí dài hạn.',
  'Biến động toàn cầu tác động thương mại và đầu tư.'
];
const pageHeadline = page => pageSummaries[page.type] || page.thesis;
const pageContext = page => pageContexts[page.roman] || pageContexts[page.type] || '';

function PageArtwork({ page }) {
  const photoGroups = {
    M1: ['https://commons.wikimedia.org/wiki/Special:Redirect/file/Wikipedia_workshop_at_University_of_Economics_and_Business,_Vietnam_National_University.jpg?width=960'],
    '5.1': ['https://commons.wikimedia.org/wiki/Special:Redirect/file/Discovery_C%E1%BA%A7u_Gi%E1%BA%A5y.jpg?width=960'],
    '3.1': ['real-agriculture.jpg', 'real-industry.jpg', 'real-services.jpg'],
    I: ['01-cau-hoi-trong-tam.jpg'],
    III: ['03-mot-mo-hinh-phat-trien.jpg'],
    IV: ['04-ba-co-so-lua-chon.jpg'],
    V: ['05-xu-huong-phat-trien.jpg'],
    VI: ['06-uu-the-thi-truong.jpg'],
    VII: ['07-phat-trien-vi-con-nguoi.jpg'],
    VIII: ['08-nam-phuong-dien.jpg'],
    IX: ['09-muc-tieu-phat-trien.jpg'],
    X: ['10-so-huu-da-dang.jpg'],
    XI: ['11-quan-ly-nen-kinh-te.jpg'],
    XII: ['12-hinh-thuc-phan-phoi.jpg'],
    XIII: ['13-tang-truong-cong-bang.jpg'],
    XIV: ['02-do-thi-ha-tang.jpg'],
    '3.2': ['real-mechanized-agriculture.jpg'],
    '3.4': ['real-services.jpg'],
    XV: ['07-moi-truong-phat-trien-xanh.jpg'],
    '4.3': ['https://commons.wikimedia.org/wiki/Special:Redirect/file/Mekong_Delta,_Vietnam_(Copernicus).jpg?width=960'],
    XVI: ['05-nguon-nhan-luc.jpg']
  };
  const photoCaptions = {
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mekong_Delta,_Vietnam_(Copernicus).jpg?width=960': 'Ảnh vệ tinh Copernicus thể hiện biến đổi theo mùa ở Đồng bằng sông Cửu Long, 2020–2021',
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Wikipedia_workshop_at_University_of_Economics_and_Business,_Vietnam_National_University.jpg?width=960': 'Sinh viên tham gia buổi học tại Đại học Kinh tế, Đại học Quốc gia Hà Nội',
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Discovery_C%E1%BA%A7u_Gi%E1%BA%A5y.jpg?width=960': 'Đường chân trời Cầu Giấy, Hà Nội với tuyến metro trên cao',
    '02-do-thi-ha-tang.jpg': 'Minh họa phát triển đô thị và hạ tầng kinh tế',
    '05-nguon-nhan-luc.jpg': 'Minh họa đào tạo nhân lực và ứng dụng khoa học – công nghệ',
    '07-moi-truong-phat-trien-xanh.jpg': 'Minh họa sức ép môi trường và yêu cầu phát triển xanh',
    '09-chenh-lech-phat-trien.jpg': 'Minh họa khác biệt về điều kiện sống và phát triển đô thị',
    'real-agriculture.jpg': 'Ruộng lúa tại Việt Nam',
    'real-industry.jpg': 'Cơ sở sản xuất Exxelia tại Việt Nam',
    'real-services.jpg': 'Tàu container vận tải trên sông Sài Gòn',
    'real-mechanized-agriculture.jpg': 'Máy kéo làm đất trên ruộng lúa ở Đồng bằng sông Cửu Long',
    '01-cau-hoi-trong-tam.jpg': 'Minh họa câu hỏi trọng tâm của chuyên đề',
    '03-mot-mo-hinh-phat-trien.jpg': 'Minh họa mô hình phát triển kinh tế',
    '04-ba-co-so-lua-chon.jpg': 'Minh họa ba cơ sở của sự lựa chọn',
    '05-xu-huong-phat-trien.jpg': 'Minh họa kết nối kinh tế và đô thị',
    '06-uu-the-thi-truong.jpg': 'Minh họa động lực và ưu thế của thị trường',
    '07-phat-trien-vi-con-nguoi.jpg': 'Minh họa phát triển vì con người',
    '08-nam-phuong-dien.jpg': 'Minh họa năm phương diện liên kết',
    '09-muc-tieu-phat-trien.jpg': 'Minh họa mục tiêu phát triển kinh tế và xã hội',
    '10-so-huu-da-dang.jpg': 'Minh họa các hình thức sở hữu và khu vực kinh tế',
    '11-quan-ly-nen-kinh-te.jpg': 'Minh họa quản lý nền kinh tế',
    '12-hinh-thuc-phan-phoi.jpg': 'Minh họa các hình thức phân phối',
    '13-tang-truong-cong-bang.jpg': 'Minh họa mối liên hệ giữa tăng trưởng và công bằng'
  };
  const photoCredits = {
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mekong_Delta,_Vietnam_(Copernicus).jpg?width=960': { author:'European Union, Copernicus Sentinel-1 imagery', license:'Contains modified Copernicus Sentinel data 2020', licenseUrl:'https://www.copernicus.eu/en/access-data/copernicus-services-data', url:'https://commons.wikimedia.org/wiki/File:Mekong_Delta,_Vietnam_(Copernicus).jpg', original:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mekong_Delta,_Vietnam_(Copernicus).jpg' },
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Wikipedia_workshop_at_University_of_Economics_and_Business,_Vietnam_National_University.jpg?width=960': { author:'Sir Nicholas de Mimsy-Porpington', license:'CC BY-SA 4.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/', url:'https://commons.wikimedia.org/wiki/File:Wikipedia_workshop_at_University_of_Economics_and_Business,_Vietnam_National_University.jpg', original:'https://upload.wikimedia.org/wikipedia/commons/1/1d/Wikipedia_workshop_at_University_of_Economics_and_Business%2C_Vietnam_National_University.jpg' },
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Discovery_C%E1%BA%A7u_Gi%E1%BA%A5y.jpg?width=960': { author:'NKSTTSSHNVN', license:'CC BY-SA 4.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/', url:'https://commons.wikimedia.org/wiki/File:Discovery_C%E1%BA%A7u_Gi%E1%BA%A5y.jpg', original:'https://upload.wikimedia.org/wikipedia/commons/0/04/Discovery_C%E1%BA%A7u_Gi%E1%BA%A5y.jpg' },
    'real-agriculture.jpg': { author:'Chris Feser', license:'CC BY 2.0', licenseUrl:'https://creativecommons.org/licenses/by/2.0/', url:'https://commons.wikimedia.org/wiki/File:Rice_fields_in_Vietnam.jpg', original:'https://upload.wikimedia.org/wikipedia/commons/8/8f/Rice_fields_in_Vietnam.jpg' },
    'real-industry.jpg': { author:'Exxelia Groupe', license:'CC BY-SA 4.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/', url:'https://commons.wikimedia.org/wiki/File:Exxelia_Usine_-_Vietnam.jpg', original:'https://upload.wikimedia.org/wikipedia/commons/f/f6/Exxelia_Usine_-_Vietnam.jpg' },
    'real-services.jpg': { author:'Syced', license:'CC0', licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/', url:'https://commons.wikimedia.org/wiki/File:Container_ships_on_Saigon_River.jpg', original:'https://upload.wikimedia.org/wikipedia/commons/5/5e/Container_ships_on_Saigon_River.jpg' },
    'real-mechanized-agriculture.jpg': { author:'Thomas Schoch', license:'CC BY-SA 3.0', licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/', url:'https://commons.wikimedia.org/wiki/File:Tractor_Mekong_Delta_Vietnam.jpg', original:'https://upload.wikimedia.org/wikipedia/commons/b/be/Tractor_Mekong_Delta_Vietnam.jpg' }
  };
  const photos = photoGroups[page.roman];
  if (photos) return <div className={`page-artwork photo-gallery ${photos.length > 1 ? 'photo-gallery-multiple' : ''} ${photos.length === 2 ? 'photo-gallery-pair' : ''} ${photos.length > 2 ? 'photo-gallery-triple' : ''}`}>
    {photos.map(file => <figure className="book-photo" key={file}>
      {photoCredits[file]?<a className="photo-image-link" href={photoCredits[file].original} target="_blank" rel="noreferrer" aria-label={`Xem ảnh gốc: ${photoCaptions[file]}`}><img src={file.startsWith('https://')?file:`/images/book/${file}?v=3`} alt={photoCaptions[file]} loading="lazy" /></a>:<img src={file.startsWith('https://')?file:`/images/book/${file}?v=3`} alt={photoCaptions[file]} loading="lazy" />}
      {photoCredits[file]&&<figcaption><small>Ảnh: <a href={photoCredits[file].url} target="_blank" rel="noreferrer">{photoCredits[file].author}</a> · <a href={photoCredits[file].licenseUrl} target="_blank" rel="noreferrer">{photoCredits[file].license}</a></small></figcaption>}
    </figure>)}
  </div>;
  const captions = {
    question:'BA CÂU HỎI · MỘT HÀNH TRÌNH', concept:'THỊ TRƯỜNG + ĐỊNH HƯỚNG XÃ HỘI',
    branches:'BA CƠ SỞ · MỘT LỰA CHỌN', argument:page.roman==='V'?'TRAO ĐỔI · KẾT NỐI · PHÁT TRIỂN':page.roman==='VI'?'CẠNH TRANH · ĐỔI MỚI · NĂNG SUẤT':'TĂNG TRƯỞNG VÌ CON NGƯỜI',
    'feature-index':'NĂM ĐẶC TRƯNG CỦA MÔ HÌNH', feature:'PHÁT TRIỂN LẤY CON NGƯỜI LÀM TRUNG TÂM',
    ownership:'NHÀ NƯỚC · TƯ NHÂN · TẬP THỂ', management:'THỊ TRƯỜNG · NHÀ NƯỚC · ĐỊNH HƯỚNG',
    distribution:'LAO ĐỘNG · NGUỒN LỰC · PHÚC LỢI', cycle:'TĂNG TRƯỞNG ↔ TIẾN BỘ XÃ HỘI',
    achievements:'THÀNH TỰU TRÊN NHIỀU PHƯƠNG DIỆN', challenges:'NHẬN DIỆN ĐIỂM NGHẼN',
    roadmap:'TỪ THỂ CHẾ ĐẾN PHÁT TRIỂN BỀN VỮNG'
  };
  let art;
  if(page.type==='question') art=<><path d="M90 76h135c18 0 32 10 35 24 3-14 17-24 35-24h135v82H260c-8-12-17-18-30-18H90z" fill="#f8f2e7" stroke="#b19362" strokeWidth="3"/><path d="M260 100v58M110 98h95m-95 18h80m90-18h96m-96 18h78" stroke="#c9b895" strokeWidth="4" strokeLinecap="round"/><circle cx="131" cy="54" r="18" fill="#622b34"/><circle cx="260" cy="43" r="18" fill="#b19362"/><circle cx="390" cy="54" r="18" fill="#80786f"/><text x="131" y="60" textAnchor="middle">?</text><text x="260" y="49" textAnchor="middle">?</text><text x="390" y="60" textAnchor="middle">?</text></>;
  else if(page.type==='concept') art=<><circle cx="194" cy="101" r="45" fill="#e5d8bf"/><circle cx="260" cy="86" r="45" fill="#c8b58e"/><circle cx="326" cy="101" r="45" fill="#e8dfcf"/><path d="M145 158h230M178 147v11m164-11v11" stroke="#8b7757" strokeWidth="3"/><path d="M220 81h80m-40-26v54m-27-13h54" stroke="#622b34" strokeWidth="3" strokeLinecap="round"/></>;
  else if(page.type==='branches') art=<><path d="M260 143V78M260 98L153 48M260 98l107-50M260 78v-42" fill="none" stroke="#b19362" strokeWidth="5" strokeLinecap="round"/><circle cx="153" cy="48" r="24" fill="#622b34"/><circle cx="367" cy="48" r="24" fill="#b19362"/><circle cx="260" cy="36" r="24" fill="#80786f"/><circle cx="260" cy="143" r="17" fill="#d8cbb4"/></>;
  else if(page.type==='argument'&&page.roman==='V') art=<><path d="M97 145h326" stroke="#9c8b70" strokeWidth="3"/><path d="M122 144V92h76v52m18 0V70h76v74m18 0V94h76v50" fill="#d7c6a7" stroke="#a98b5d" strokeWidth="3"/><path d="M139 110h15m18 0h15m-48 17h15m18 0h15m33-38h15m18 0h15m-48 20h15m18 0h15m32 3h15m18 0h15" stroke="#f8f2e7" strokeWidth="5"/><path d="M105 64c75-43 165-39 294-5" fill="none" stroke="#622b34" strokeWidth="3" strokeDasharray="6 8"/></>;
  else if(page.type==='argument'&&page.roman==='VI') art=<><path d="M110 148h300M135 145v-30h46v30m26 0V93h46v52m26 0V68h46v77m26 0V46h46v99" fill="#cdbb98"/><path d="M122 101l66-29 56 10 69-42 65 6" fill="none" stroke="#622b34" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="378" cy="46" r="9" fill="#b19362"/></>;
  else if(page.type==='argument') art=<><circle cx="260" cy="65" r="28" fill="#d8c6a6"/><path d="M211 148c4-42 18-64 49-64s45 22 49 64" fill="#622b34"/><circle cx="175" cy="82" r="18" fill="#b19362"/><path d="M143 148c3-30 13-47 32-47s29 17 32 47m80 0c3-30 13-47 32-47s29 17 32 47" fill="#9b8274"/><path d="M99 154h322" stroke="#b19362" strokeWidth="3"/></>;
  else if(page.type==='feature-index') art=<>{[132,196,260,324,388].map((x,i)=><g key={x}><circle cx={x} cy="87" r="27" fill={['#622b34','#b19362','#80786f','#cbb68f','#9b8274'][i]}/><text x={x} y="93" textAnchor="middle">{i+1}</text>{i<4&&<path d={`M${x+28} 87h36`} stroke="#b19362" strokeWidth="3"/>}</g>)}</>;
  else if(page.type==='feature') art=<><circle cx="260" cy="88" r="55" fill="#eee3ce" stroke="#b19362" strokeWidth="3"/><circle cx="260" cy="88" r="36" fill="none" stroke="#c8b58e" strokeWidth="3"/><circle cx="260" cy="88" r="17" fill="#622b34"/><path d="M260 20v18m0 100v18m-68-68h18m100 0h18m-116-48 13 13m70 70 13 13m0-96-13 13m-70 70-13 13" stroke="#b19362" strokeWidth="3" strokeLinecap="round"/></>;
  else if(page.type==='ownership') art=<><rect x="104" y="71" width="92" height="74" rx="5" fill="#622b34"/><rect x="214" y="48" width="92" height="97" rx="5" fill="#b19362"/><rect x="324" y="82" width="92" height="63" rx="5" fill="#80786f"/><path d="M124 92h52m-52 18h52m-52 18h52m17-57h52m-52 18h52m-52 18h52m-52 18h52m18-26h52m-52 18h52" stroke="#f8f2e7" strokeWidth="4" strokeLinecap="round"/></>;
  else if(page.type==='management') art=<><path d="M260 98L151 48m109 50 109-50M260 98v50" stroke="#b19362" strokeWidth="4"/><circle cx="260" cy="98" r="38" fill="#622b34"/><circle cx="151" cy="48" r="27" fill="#c8b58e"/><circle cx="369" cy="48" r="27" fill="#80786f"/><circle cx="260" cy="148" r="24" fill="#d7c6a7"/><path d="M145 48h12m206 0h12m-109 92v16" stroke="#f8f2e7" strokeWidth="4" strokeLinecap="round"/></>;
  else if(page.type==='distribution') art=<><path d="M143 59v74m117-74v74m117-74v74" stroke="#b19362" strokeWidth="3"/><path d="M119 85h48l-24 43zm117 0h48l-24 43zm117 0h48l-24 43z" fill="#e1d2b7" stroke="#8b7757" strokeWidth="3"/><circle cx="143" cy="49" r="14" fill="#622b34"/><circle cx="260" cy="49" r="14" fill="#b19362"/><circle cx="377" cy="49" r="14" fill="#80786f"/></>;
  else if(page.type==='cycle') art=<><path d="M193 48a75 55 0 0 1 119-7l16-4-8 29-27-12 13-8m-46 78a75 55 0 0 1-119 7l-16 4 8-29 27 12-13 8" fill="none" stroke="#b19362" strokeWidth="5" strokeLinejoin="round"/><circle cx="260" cy="89" r="34" fill="#622b34"/><path d="M260 65v48m-18-18h36" stroke="#f7efdf" strokeWidth="4" strokeLinecap="round"/></>;
  else if(page.type==='achievements') art=<><circle cx="385" cy="39" r="22" fill="#e1cd9f"/><path d="M100 145h320M122 144V98h52v46m25 0V76h52v68m25 0V55h52v89m25 0V39h52v105" fill="#c8b58e"/><path d="M142 88v-8m71-10v-9m77-9V42m77-10V20" stroke="#622b34" strokeWidth="4"/></>;
  else if(page.type==='challenges') art=<><path d="M83 148 170 55l57 58 63-78 103 113" fill="#ded0b8" stroke="#b19362" strokeWidth="3" strokeLinejoin="round"/><path d="M99 150c72-13 101-40 154-41 51-1 82 24 149 35" fill="none" stroke="#622b34" strokeWidth="4" strokeDasharray="7 8"/><circle cx="253" cy="109" r="10" fill="#622b34"/><path d="M247 98l6-16 7 16" stroke="#622b34" strokeWidth="3"/></>;
  else art=<><path d="M104 150h312" stroke="#b19362" strokeWidth="3"/><path d="M124 148v-24h62v24m17 0V98h62v50m17 0V72h62v76m17 0V46h62v102" fill="#d7c6a7"/><path d="M385 46V24h30l-15 12h-15" fill="#622b34"/><circle cx="132" cy="104" r="7" fill="#b19362"/><circle cx="218" cy="78" r="7" fill="#b19362"/><circle cx="305" cy="52" r="7" fill="#b19362"/></>;
  return <figure className="page-artwork"><svg viewBox="0 0 520 170" aria-hidden="true"><rect x="8" y="7" width="504" height="156" rx="8" fill="#eee5d5"/><path d="M20 144c77-32 119 3 192-7s113-41 189-25 90 5 99-1v43H20z" fill="#e1d5c1" opacity=".78"/>{art}</svg><figcaption>{captions[page.type]}</figcaption></figure>;
}

function BookPage({ page, pageNumber, goTo, readerPages=pages }) {
  const [choice,setChoice]=useState(page.type==='roadmap'?-1:0);
  return <article className={`book-page page-${page.type}`} data-roman={page.roman.toLowerCase()}>
    {page.type==='back-cover'&&<div className="back-cover-art"><div className="back-cover-frame"><span className="back-cover-kicker">MLN122 <i>·</i> NHÓM 05</span><div className="back-cover-ornament">✳</div><p>{pageHeadline(page)}</p><span className="back-cover-rule"/><small>POLITICAL ECONOMY · VIỆT NAM</small><button onClick={()=>goTo(-1)}><BookOpen size={16}/> ĐÓNG SÁCH</button></div></div>}
    <div className="page-topline"><span>MLN122 <i>·</i> KINH TẾ CHÍNH TRỊ MÁC – LÊNIN</span><span>{page.section}</span></div>
    <div className="page-content">
      <span className="page-kicker">{page.roman} <i>/</i> {page.section}</span>
      <h2>{page.title}</h2>
      {!['toc','back-cover','conclusion','essay','references'].includes(page.type)&&<PageArtwork page={page}/>}
      {page.type==='toc'&&<><p className="page-thesis toc-thesis">{pageHeadline(page)}</p><div className="book-toc-grid">{pages.map((entry,index)=>({entry,index})).filter(({entry})=>entry.tocEntry||['I','III','IV','VIII','XIV','XV','XVI','XVII'].includes(entry.roman)).map(({entry,index})=><button key={entry.roman} onClick={()=>goTo(readerPages.findIndex(rendered=>rendered.roman===entry.roman))}><span>{String(readerPages.findIndex(rendered=>rendered.roman===entry.roman)+1).padStart(2,'0')}</span><b>{entry.title}</b><i>{entry.section}</i></button>)}</div></>}
      {page.type==='question'&&<><p className="question-text">Ba câu hỏi chính: Vì sao cần? Mô hình có đặc trưng gì? Kết quả và thách thức ra sao?</p><div className="three-questions">{page.items.map(item=><div key={item[0]}><span>{item[0]}</span><b>{item[1]}</b><p>{item[2]}</p></div>)}</div></>}
      {page.type==='concept'&&<><p className="definition">{pageHeadline(page)}</p><PageContext page={page}/><div className="concept-ribbon"><span>THỊ TRƯỜNG</span><i>×</i><span>THỂ CHẾ</span><i>×</i><span>MỤC TIÊU XÃ HỘI</span></div></>}
      {page.type==='branches'&&<><p className="page-thesis">{pageHeadline(page)}</p><PageContext page={page}/><div className="branch-list">{page.items.map((x,i)=><button key={x[0]} onClick={()=>goTo(pages.findIndex(entry=>entry.roman===['V','VI','VII'][i]))}><span>{x[0]}</span><span><b>{x[1]}</b><small>{x[2]}</small></span><ArrowRight size={16}/></button>)}</div></>}
      {page.type==='argument'&&<><p className="page-thesis">{pageHeadline(page)}</p><PageContext page={page}/><ArgumentDetails page={page}/></>}
      {page.type==='feature-index'&&<><p className="page-thesis">{pageHeadline(page)}</p><PageContext page={page}/><div className="feature-index">{page.items.map((item,i)=><button key={item[0]} onClick={()=>goTo(featurePages[i])}><span>{item[0]}</span><b>{item[1]}</b><ArrowRight size={15}/></button>)}</div></>}
      {page.type==='feature'&&<><p className="feature-quote">{pageHeadline(page)}</p><PageContext page={page}/><div className="remember"><Bookmark size={14}/><span>{page.takeaway}</span></div></>}
      {page.type==='ownership'&&<><p className="page-thesis">{pageHeadline(page)}</p><PageContext page={page}/><div className="ownership-map">{page.items.map((item,i)=><button key={item[0]} onClick={()=>setChoice(i)} className={choice===i?'chosen':''}><span>0{i+1}</span><b>{item[0]}</b><small>{item[1]}</small></button>)}</div></>}
      {page.type==='management'&&<><p className="page-thesis">{pageHeadline(page)}</p><PageContext page={page}/><div className="management-map">{page.items.map((x,i)=><button key={x[0]} onClick={()=>setChoice(i)} className={choice===i?'chosen':''}><b>{x[0]}</b><span>{x[1]}</span></button>)}<div className="management-core">THỂ CHẾ<br/>KINH TẾ</div></div></>}
      {page.type==='distribution'&&<><p className="page-thesis">{pageHeadline(page)}</p><PageContext page={page}/><div className="distribution-lines"><span>KẾT QUẢ LAO ĐỘNG</span><i>+</i><span>HIỆU QUẢ & ĐÓNG GÓP</span><i>+</i><span>PHÚC LỢI XÃ HỘI</span></div></>}
      {page.type==='cycle'&&<><p className="page-thesis">{pageHeadline(page)}</p><PageContext page={page}/><div className="cycle-diagram"><div><b>TĂNG TRƯỞNG KINH TẾ</b><span>Nguồn lực · việc làm · thu nhập</span></div><ArrowRight/><div><b>TIẾN BỘ XÃ HỘI</b><span>Tri thức · sức khỏe · cơ hội</span></div><div className="cycle-return">Nền tảng cho phát triển bền vững</div></div></>}
      {page.type==='achievements'&&<><p className="page-thesis">{pageHeadline(page)}</p><PageContext page={page}/><div className="achievement-list">{page.items.map((item,i)=><div key={item[0]}><span>{item[0]}</span><div><b>{item[1]}</b><p>{achievementNotes[i]}</p></div></div>)}</div></>}
      {page.type==='challenges'&&<><p className="page-thesis">{pageHeadline(page)}</p><PageContext page={page}/><div className="challenge-table"><div className="challenge-head"><span>THÁCH THỨC</span><span>VÌ SAO CẦN LƯU Ý</span></div>{page.items.map((item,i)=><div key={item[0]} className="challenge-row"><b><i>0{i+1}</i>{item[0]}</b><p>{challengeNotes[i]}</p></div>)}</div></>}
      {page.type==='roadmap'&&<><p className="page-thesis">{pageHeadline(page)}</p><PageContext page={page}/><div className="roadmap-list">{page.items.map((item,i)=><button key={item[0]} className={choice===i?'chosen':''} onClick={()=>setChoice(choice===i?-1:i)}><span>{item[0]}</span><b>{item[1]}</b><ChevronDown size={14}/>{choice===i&&<p>{item[2]}</p>}</button>)}</div></>}
      {page.type==='essay'&&<>{!page.continued&&<p className="page-thesis essay-thesis">{pageHeadline(page)}</p>}{page.roman==='3.1'&&!page.continued&&<PageArtwork page={page}/>}<div className="essay-copy">{['3.2','3.4','4.3','M1','5.1'].includes(page.roman)&&!page.continued&&<PageArtwork page={page} />}{page.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>{page.example&&<aside className="essay-example"><span>VÍ DỤ MINH HỌA</span><p>{page.example}</p></aside>}{page.takeaway&&<p className="essay-takeaway"><Bookmark size={12}/>{page.takeaway}</p>}{page.source&&<p className="essay-source">Nguồn: <a href={page.sourceUrl} target="_blank" rel="noreferrer">{page.source}</a></p>}</>}
      {page.type==='references'&&<><p className="page-thesis">{pageHeadline(page)}</p><div className="academic-references">{references.map((reference,index)=><a key={reference.url} href={reference.url} target="_blank" rel="noreferrer"><span>{String(index+1).padStart(2,'0')}</span><b>{reference.label}</b><ArrowRight size={13}/></a>)}</div><p className="references-note">Số liệu được ghi theo kỳ tham chiếu và đơn vị công bố. Ảnh tư liệu trang 3.1, 3.2 và 3.4 có nguồn, giấy phép trong chú thích; 9 ảnh thay thế và các ảnh minh họa còn lại được tạo bằng AI.</p></>}
      {page.type==='conclusion'&&<><div className="conclusion-opening"><p className="conclusion-lead">{pageHeadline(page)}</p><svg className="conclusion-illustration" viewBox="0 0 620 190" role="img" aria-label="Minh họa tăng trưởng kinh tế gắn với phát triển con người"><path d="M20 155H600" stroke="#c8b58e" strokeWidth="2"/><path d="M40 153c75-56 125-34 194-64 56-25 101-11 158-42 57-30 117-22 185-48" fill="none" stroke="#b19362" strokeWidth="3" strokeDasharray="6 8"/><circle cx="574" cy="42" r="24" fill="#e0c895" opacity=".55"/><rect x="73" y="108" width="62" height="45" rx="3" fill="#d7c6a7"/><rect x="154" y="84" width="62" height="69" rx="3" fill="#c4aa7c"/><rect x="235" y="61" width="62" height="92" rx="3" fill="#b19362"/><path d="M103 107V91h30v17M183 83V65h30v18M264 60V39h30v21" fill="none" stroke="#806844" strokeWidth="3"/><circle cx="405" cy="98" r="14" fill="#622b34"/><path d="M379 151c2-27 11-41 26-41s25 14 27 41" fill="#622b34"/><circle cx="466" cy="111" r="11" fill="#946f64"/><path d="M445 151c2-21 9-32 21-32s19 11 21 32" fill="#946f64"/><circle cx="524" cy="104" r="12" fill="#b19362"/><path d="M502 151c2-23 10-35 22-35s20 12 22 35" fill="#b19362"/><path d="M334 154v-31m-12 0h24m-20-15 8 15 8-15" stroke="#622b34" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div><div className="conclusion-visual-caption"><span>ĐỘNG LỰC THỊ TRƯỜNG</span><i>→</i><span>TĂNG TRƯỞNG</span><i>→</i><span>CHẤT LƯỢNG SỐNG</span></div><div className="conclusion-points">{page.items.map(item=><div key={item[0]}><span>{item[0]}</span><b>{item[1]}</b><p>{item[2]}</p></div>)}</div><p className="conclusion-close">Tiếp tục hoàn thiện thể chế để tăng trưởng đi cùng tiến bộ, công bằng và phát triển bền vững.</p><p className="thank-you">CẢM ƠN GIẢNG VIÊN VÀ CÁC BẠN</p><div className="reference-list"><span>NGUỒN THAM KHẢO</span>{references.slice(0,3).map(r=><a key={r.url} href={r.url} target="_blank" rel="noreferrer">{r.label}<ArrowRight size={12}/></a>)}</div></>}
    </div>
    <footer className="page-footer"><span>{pageNumber % 2 === 1 ? 'NHÓM 05 · MLN122' : 'KINH TẾ THỊ TRƯỜNG ĐỊNH HƯỚNG XHCN'}</span><b>{String(pageNumber).padStart(2,'0')}</b></footer>
  </article>
}

function PageContext({page}) {
  const text=pageContext(page);
  return text&&<p className="page-context"><span>ĐIỀU CẦN NẮM</span>{text}</p>;
}

function ArgumentDetails({page}) {
  const detail=argumentDetails[page.roman];
  if(!detail)return null;
  return <section className="argument-details" aria-label={detail.title}>
    <h3>{detail.title}</h3>
    <div className="argument-steps">{detail.points.map(([title,text],index)=><div key={title}><span>0{index+1}</span><b>{title}</b><p>{text}</p></div>)}</div>
    <aside><span>LIÊN HỆ THỰC TẾ</span><p>{detail.example}</p></aside>
  </section>;
}

const FlipPage = React.forwardRef(function FlipPage({page,pageNumber,goTo,readerPages},ref){
  return <div className="flip-page-shell" ref={ref}><BookPage page={page} pageNumber={pageNumber} goTo={goTo} readerPages={readerPages}/></div>
});

function BookCover({ openBook, opening=false }) {
  return <motion.div className="closed-book" style={{transformOrigin:'left center'}} initial={opening?{opacity:1,y:0,rotateX:0,rotateY:0,x:0,scale:1}:{opacity:0,y:18,rotateX:4}} animate={opening?{opacity:0,rotateY:-155,x:-35,scale:.98}:{opacity:1,y:0,rotateX:0,rotateY:0,x:0,scale:1}} transition={{duration:opening ? 0.68 : 0.8,ease:[.2,.75,.25,1]}}>
    <div className="cover-pages"/><div className="cover-spine"/><div className="cover-face"><div className="cover-border"><div className="cover-topline">MLN122 <i>—</i> KINH TẾ CHÍNH TRỊ MÁC – LÊNIN</div><div className="cover-ornament"><span/><i>✳</i><span/></div><div className="cover-title"><span>KINH TẾ THỊ TRƯỜNG</span><em>ĐỊNH HƯỚNG</em><strong>XÃ HỘI CHỦ NGHĨA</strong><small>TẠI VIỆT NAM</small></div><div className="cover-bottom"><span>THE POLITICAL ECONOMY<br/>AN INTERACTIVE ACADEMIC BOOK</span><button onClick={openBook}>MỞ SÁCH <ArrowRight size={15}/></button><b>NHÓM 05</b></div></div></div>
  </motion.div>
}

function App(){
  const [opened,setOpened]=useState(false),[opening,setOpening]=useState(false),[toc,setToc]=useState(false),[fullscreen,setFullscreen]=useState(false),[single,setSingle]=useState(false),[orientation,setOrientation]=useState('landscape'),[pageIndex,setPageIndex]=useState(0),[flipState,setFlipState]=useState('read'),[size,setSize]=useState({width:600,height:740});
  const readerPages=pages;
  const bookRef=useRef(null),openTimer=useRef(null);
  useEffect(()=>{const update=()=>{const portrait=window.matchMedia('(max-width: 860px)').matches;setSingle(portrait);const maxH=Math.min(window.innerHeight*.78,840);if(portrait){const w=Math.max(260,Math.min(window.innerWidth*.9,maxH*.72));setSize({width:Math.round(w),height:Math.round(Math.min(maxH,w/.68))})}else{const h=maxH;const w=Math.max(280,Math.min(window.innerWidth*.46,h*.85));setSize({width:Math.round(w),height:Math.round(h)})}};update();window.addEventListener('resize',update);return()=>window.removeEventListener('resize',update)},[]);
  useEffect(()=>()=>clearTimeout(openTimer.current),[]);
  const openBook=()=>{setOpening(true);openTimer.current=setTimeout(()=>{setOpened(true);setOpening(false);setPageIndex(0)},850)};
  const changePage=useCallback(e=>{if(Number.isInteger(e?.data))setPageIndex(e.data)},[]);
  const turn=(direction)=>{const api=bookRef.current?.pageFlip?.();if(!api)return;if(direction==='next')api.flipNext('bottom');else api.flipPrev('bottom')};
  const turnToPage=(target)=>{const sourceRoman=pages[target]?.roman;const displayIndex=readerPages.findIndex(page=>page.roman===sourceRoman);if(displayIndex<0)return;bookRef.current?.pageFlip?.().turnToPage(displayIndex);setPageIndex(displayIndex);setToc(false)};
  const toggleFullscreen=async()=>{try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();setFullscreen(true)}else{await document.exitFullscreen();setFullscreen(false)}}catch{}}
  useEffect(()=>{const onKey=e=>{if(e.key==='Escape'&&toc){setToc(false);return}if(toc)return;if(e.key==='ArrowRight'){e.preventDefault();turn('next')}if(e.key==='ArrowLeft'){e.preventDefault();turn('prev')}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[toc]);
  const closeToCover=()=>{setToc(false);setOpened(false);setOpening(false);setPageIndex(0)};
  const indicatorStart=single?pageIndex:Math.floor(pageIndex/2)*2;
  const indicatorEnd=single?pageIndex+1:Math.min(indicatorStart+2,readerPages.length);
  const totalWidth=single?size.width:size.width*2;
  const turnToPageAndClose=target=>{if(target<0){closeToCover();return}turnToPage(target)};

  return <main className={`reader ${opened?'is-open':'is-closed'} ${single?'single-page':''}`}>
    <div className="ambient-mark">POLITICAL ECONOMY <i>·</i> VIỆT NAM</div>
    <div className="reader-heading"><span>{bookMeta.course}</span>{opened&&<span className="reading-label">SÁCH SỐ TƯƠNG TÁC <i>·</i> NHÓM 05</span>}</div>
    <section className="book-stage" style={{width:`${totalWidth}px`,height:`${size.height}px`}} aria-label="Sách tương tác">
      {!opened&&!opening&&<BookCover openBook={openBook}/>}
      {(opened||opening)&&<div className="flipbook-shell"><HTMLFlipBook ref={bookRef} className="book-flip" width={size.width} height={size.height} size="fixed" minWidth={220} maxWidth={1000} minHeight={360} maxHeight={1400} drawShadow usePortrait={single} startPage={0} autoSize={false} maxShadowOpacity={0.58} showCover={false} showPageCorners mobileScrollSupport={false} swipeDistance={42} flippingTime={1050} clickEventForward useMouseEvents onFlip={changePage} onChangeOrientation={e=>setOrientation(e.data)} onChangeState={e=>setFlipState(e.data)}>
          {readerPages.map((page,i)=><FlipPage key={page.roman} page={page} readerPages={readerPages} pageNumber={i+1} goTo={turnToPageAndClose}/>)}</HTMLFlipBook><span className={`corner-cue ${flipState==='user_fold'||flipState==='fold_corner'?'visible':''}`}>KÉO GÓC TRANG ĐỂ LẬT</span></div>}
      {opening&&<BookCover opening openBook={()=>{}}/>}
      <AnimatePresence>{toc&&<><motion.button className="toc-scrim" aria-label="Đóng mục lục" onClick={()=>setToc(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/><motion.aside className="toc-panel" initial={{x:30,opacity:0}} animate={{x:0,opacity:1}} exit={{x:30,opacity:0}}><div className="toc-heading"><div><span>MLN122 · NHÓM 05</span><h2>Mục lục</h2></div><button className="tool-button" onClick={()=>setToc(false)} aria-label="Đóng mục lục"><X/></button></div><button className="toc-cover" onClick={closeToCover}><span>BÌA SÁCH</span><b>Kinh tế thị trường định hướng XHCN</b><ArrowLeft size={15}/></button><div className="toc-items">{pages.map((p,i)=><button className={indicatorStart===readerPages.findIndex(entry=>entry.roman===p.roman)||indicatorEnd-1===readerPages.findIndex(entry=>entry.roman===p.roman)?'current':''} onClick={()=>turnToPage(i)} key={p.roman}><span>{p.roman}</span><b>{p.title}</b><small>{String(readerPages.findIndex(entry=>entry.roman===p.roman)+1).padStart(2,'0')}</small></button>)}</div></motion.aside></>}</AnimatePresence>
    </section>
    {opened&&<><nav className="book-controls" aria-label="Điều hướng sách"><span className="page-indicator">TRANG {String(indicatorStart+1).padStart(2,'0')}{indicatorEnd>indicatorStart+1?`–${String(indicatorEnd).padStart(2,'0')}`:''} / {readerPages.length}</span><span className="control-separator"/><button className={`control-button text-control ${toc?'selected':''}`} onClick={()=>setToc(!toc)} aria-label="Mục lục"><List/><span>MỤC LỤC</span></button><button className="control-button" onClick={toggleFullscreen} aria-label={fullscreen?'Thoát toàn màn hình':'Toàn màn hình'}>{fullscreen?<Minimize2/>:<Maximize2/>}</button><button className="control-button" onClick={closeToCover} aria-label="Quay về bìa"><BookOpen/><span className="return-label">BÌA</span></button></nav><div className="flip-instruction">DÙNG PHÍM ← → HOẶC KÉO GÓC TRANG ĐỂ LẬT SÁCH</div></>}
    {!opened&&<div className="closed-caption"><span>MỘT CUỐN SÁCH VỀ BA CÂU HỎI LỚN</span><span>01 — SỰ CẦN THIẾT &nbsp; / &nbsp; 02 — ĐẶC TRƯNG &nbsp; / &nbsp; 03 — THỰC TIỄN</span></div>}
    <div className="ambient-foot"><span>THE POLITICAL ECONOMY</span><span>{opened?`TRANG ${String(indicatorStart+1).padStart(2,'0')}`:'MỞ SÁCH ĐỂ BẮT ĐẦU'}</span></div>
  </main>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
