import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import data from "../data/vietnam.json";
import useIcons from "../hooks/useIcons";
export default function Payment() {
    const icons = useIcons();
    const { cart, totalPrice } = useCart();
    const { user } = useAuth();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    // Redirect if cart empty
    if (cart.length === 0) return navigate("/cart");
    // User info logic
    const [info, setInfo] = useState({
        fullname: "",
        phone: "",
        email: "",
        city: "",
        district: "",
        ward: "",
        address: ""
    });
    useEffect(() => {
      if (!user) return;
      setInfo(prev => ({
        ...prev,
        fullname: user.fullname || "",
        phone: user.phone || "",
        email: user.email || ""
      }));
    }, [user]);

    const [payment, setPayment] = useState("cod");
    const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
        setErrors(prev => ({ ...prev, [e.target.name]: null })); //clear error when user recorrect
    };
    const handlePayment = () => {
        let newErrors = {};
        // Check fullname
        if (!info.fullname.trim()) newErrors.fullname = "Vui lòng nhập họ tên.";
        // Check phone
        const phoneRegex = /^[0-9]{9,11}$/;
        if (!info.phone.trim()){ 
          newErrors.phone = "Vui lòng nhập số điện thoại.";
        } else if (!phoneRegex.test(info.phone)){
          newErrors.phone = "Số điện thoại không hợp lệ.";
        }
        // Check email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!info.email.trim()) {
          newErrors.email = "Vui lòng nhập email.";
        } else if (!emailRegex.test(info.email)) {
          newErrors.email = "Email không hợp lệ.";
        }
        // Check info
        if (!city) newErrors.city = "Vui lòng chọn Tỉnh/Thành phố.";
        if (!district) newErrors.district = "Vui lòng chọn Quận/Huyện.";
        if (!ward) newErrors.ward = "Vui lòng chọn Phường/Xã.";
        if (!info.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ cụ thể.";
        // If errors exist → stop
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // Success
        alert("Thanh toán thành công!");
        navigate("/");
    };

    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [districtList, setDistrictList] = useState([]);
    const [wardList, setWardList] = useState([]);

    // Handle choosing Tỉnh/Thành phố
    const handleCity = (e) => {
        const value = e.target.value;
        setCity(value);
        setDistrict("");
        setWard("");
        setErrors(prev => ({ ...prev, city: null })); //clear error when user recorrect
        const cityObj = data.find((c) => c.Name === value);
        setDistrictList(cityObj ? cityObj.Districts : []);
        setWardList([]);
    };

    // Handle choosing Quận/Huyện
    const handleDistrict = (e) => {
        const value = e.target.value;
        setDistrict(value);
        setWard("");
        setErrors(prev => ({ ...prev, district: null })); //clear error when user recorrect
        const districtObj = districtList.find((d) => d.Name === value);
        setWardList(districtObj ? districtObj.Wards : []);
    };
    const disabledStyle = "bg-gray-100 cursor-not-allowed opacity-60 border-gray-300 text-gray-500";
    const paymentMethods = [
        { id: "zalopay", label: "Ví ZaloPay", icon: icons.zalopay },
        { id: "vnPay", label: "VNPAY", icon: icons.vnpay },
        { id: "momo", label: "Ví Momo", icon: icons.momo},
        { id: "atm", label: "ATM / Internet Banking", icon: icons.atm },
        { id: "visa", label: "Visa / Mastercard", icon: icons.visa },
        { id: "cod", label: "Thanh toán khi nhận hàng (COD)", icon: icons.cash }
    ];
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

      <div className="flex justify-center gap-8">
        {/** LEFT SECTION */}
        <div className="w-[55%] space-y-8">

          {/* ĐỊA CHỈ GIAO HÀNG */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h2>

            {/* Full Name */}
            <label className="block mb-4">
              <span>Họ và tên người nhận</span>
              <input
                type="text"
                name="fullname"
                value={info.fullname}
                onChange={handleChange}
                className={`w-full p-2 border rounded mt-1 ${errors.fullname ? "border-red-500" : ""}`}
              />
              {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
            </label>

            {/* Phone */}
            <label className="block mb-4">
              <span>Số điện thoại</span>
              <input
                type="text"
                name="phone"
                value={info.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded mt-1 ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </label>

            {/* Email */}
            <label className="block mb-4">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={info.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded mt-1 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </label>

            <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Tỉnh / Thành phố */}
            <label className="block mb-4">
            <span>Tỉnh / Thành phố</span>
            <select
                value={city}
                onChange={handleCity}
                className={`w-full p-2 border rounded mt-1 ${errors.city ? "border-red-500" : ""}`}
            >
                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                {data.map((c) => (
                <option key={c.Name} value={c.Name}>
                    {c.Name}
                </option>
                ))}
            </select>
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </label>

            {/* Quận / Huyện */}
            <label className="block mb-4">
            <span>Quận / Huyện</span>
            <select
                value={district}
                onChange={handleDistrict}
                disabled={!city}
                className={`w-full p-2 border rounded mt-1 ${!city ? disabledStyle : ""} ${errors.district ? "border-red-500" : ""}`}
            >
                <option value="">-- Chọn Quận/Huyện --</option>
                {districtList.map((d) => (
                <option key={d.Name} value={d.Name}>
                    {d.Name}
                </option>
                ))}
            </select>
            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
            </label>

            {/* Phường / Xã */}
            <label className="block mb-4">
            <span>Phường / Xã</span>
            <select
                value={ward}
                onChange={(e) => {
                  setWard(e.target.value);
                  setErrors(prev => ({ ...prev, ward: null })); //clear error when user recorrect
                }}
                disabled={!district}
                className={`w-full p-2 border rounded mt-1 ${!district ? disabledStyle : ""} ${errors.ward ? "border-red-500" : ""}`}
            >
                <option value="">-- Chọn Phường/Xã --</option>
                {wardList.map((w) => (
                <option key={w.Name} value={w.Name}>
                    {w.Name}
                </option>
                ))}
            </select>
            {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}
            </label>

            </div>

            <label className="block">
              <span>Địa chỉ nhận hàng</span>
              <input
                name="address"
                value={info.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded mt-1 ${errors.address ? "border-red-500" : ""}`}
              />
            </label>
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </section>

          {/* PHƯƠNG THỨC THANH TOÁN */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>

            {paymentMethods.map((p) => (
              <label key={p.id} className="flex items-center gap-3 mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={p.id}
                  checked={payment === p.id}
                  onChange={(e) => setPayment(e.target.value)}
                />
                <img src={p.icon} className="w-8 h-8 object-contain" />
                {p.label}
              </label>
            ))}
          </section>
        </div>

        {/** RIGHT CHECKOUT SUMMARY */}
        <div className="w-[45%]">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Kiểm tra lại đơn hàng</h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              <div className="flex justify-between gap-4 mb-2 text-sm text-gray-500 font-medium">
                <div className="w-16"></div> {/* image spacer */}
                <div className="w-64">Sản phẩm</div>
                <div className="w-20 text-center">Số lượng</div>
                <div className="w-28 text-right">Thành tiền</div>
              </div>
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b pb-3">
                  {/* LEFT: Image + Info */}
                  <img
                    src={item.cover}
                    className="w-16 h-20 object-cover rounded"
                    alt={item.title}
                  />

                  <div className="w-64">
                    <p className="font-medium">{item.title}</p>
                    {/* Unit price below item */}
                    <p className="text-sm text-[#6b4f45]">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>

                  <p className="w-20 text-center font-medium">{item.quantity}</p>

                  {/* RIGHT: Line total column */}
                  <p className="w-28 text-right font-semibold text-[#b74e3a]">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right text-xl font-bold text-[#4b2e2a]">
              Tổng: {totalPrice.toLocaleString("vi-VN")} ₫
            </div>

            <button
              onClick={handlePayment}
              className="w-full mt-6 bg-[#4b2e2a] text-white py-3 rounded-lg hover:bg-[#6b4f45]"
            >
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
