import { useAuth } from "../context/AuthContext";

export default function Voucher() {
  const voucher = JSON.parse(localStorage.getItem("voucher")) || [];

  return (
    <>
        <h1 className="text-2xl font-bold mb-6">Ví voucher</h1>
        {voucher.length === 0 ? (
            <p className="text-gray-500">Bạn chưa có voucher nào.</p>
        ) : (<div></div>)}
    </>
  );
}
