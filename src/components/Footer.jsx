import { Link } from "react-router-dom";
import useIcons from "../hooks/useIcons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import {faXTwitter} from '@fortawesome/free-brands-svg-icons'
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";

export default function Footer() {
  const icons = useIcons();
  return (
    <footer className="bg-[#2b1f1a] text-[#f7f3f1] mt-16">
      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto py-12 grid grid-cols-1 md:grid-cols-5 gap-15">
        <div className="col-span-2">
          {/* ABOUT */}
          <div className="flex items-center gap-2 cursor-pointer mb-3">
            <img src = {icons.logowhite}></img>
            <h1 className="text-5xl font-extrabold text-white font-mono amarante-regular">
              Discovery Book
            </h1>
          </div>
          <p className="text-base text-[#d6c9c3] leading-relaxed">
            DiscoveryBook là cửa hàng sách trực tuyến dành cho những người yêu đọc sách.
            Khám phá hàng ngàn đầu sách từ bán chạy, xu hướng đến các tác phẩm kinh điển.
          </p>

          {/* NEWSLETTER */}
          <div className="mt-4">
            <p className="text-lg font-medium mb-2">Nhận thông tin sách mới & ưu đãi</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Đã đăng ký nhận bản tin!");
              }}
              className="flex"
            >
              <input
                type="email"
                required
                placeholder="Nhập email của bạn"
                className="flex-1 px-3 py-3 text-base rounded-l bg-white text-[#2b1f1a] focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#b74e3a] text-white text-base rounded-r hover:bg-[#9d3c2e] transition"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* SERVICE */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Thông tin</h3>
          <ul className="space-y-2 text-base text-[#d6c9c3]">
            <li><Link to="#" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link to="#" className="hover:text-white">Tuyển dụng</Link></li>
            <li><Link to="#" className="hover:text-white">Hệ thống nhà sách</Link></li>    
            <li><Link to="#" className="hover:text-white">Điều khoản sử dụng</Link></li>   
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Hỗ trợ</h3>
          <ul className="space-y-2 text-base text-[#d6c9c3]">
            <li><Link to="#" className="hover:text-white">Câu hỏi thường gặp</Link></li>
            <li><Link to="#" className="hover:text-white">Chính sách bảo mật</Link></li>
            <li><Link to="#" className="hover:text-white">Chính sách đổi trả</Link></li>
            <li><Link to="#" className="hover:text-white">Chính sách vận chuyển</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Liên hệ</h3>
          <ul className="space-y-3 text-base text-[#d6c9c3]">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt size={22}/>
              <span>60-62 Lê Lợi, Q.1, TP.HCM</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt size={22}/>
              <span>0123 456 789</span>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} size="xl"/>
              <span>cskh@dicoverybook.com.vn</span>
            </li>
          </ul>

          {/* SOCIAL */}
          <div className="flex items-center gap-3 mt-4">
            <a className="p-2 bg-[#4b2e2a] rounded hover:bg-[#6b4f45]" href="#"><FaFacebookF size = {24}/></a>
            <a className="p-2 bg-[#4b2e2a] rounded hover:bg-[#6b4f45]" href="#"><FaInstagram size = {24}/></a>
            <a className="p-2 bg-[#4b2e2a] rounded hover:bg-[#6b4f45]" href="#"><FontAwesomeIcon icon={faXTwitter} size="lg"/></a>
            <a className="p-2 bg-[#4b2e2a] rounded hover:bg-[#6b4f45]" href="#"><FaYoutube size = {24}/></a>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-[#4b2e2a] text-center py-4 text-sm text-[#d6c9c3]">
        © {new Date().getFullYear()} DiscoveryBook. All rights reserved.
      </div>
    </footer>
  );
}
