import React from "react";

const Contact = () => {
  return (
    <section className="grid md:grid-cols-2 gap-6 mt-8 container">
      <div className="p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-2">Liên hệ với chúng tôi</h2>
        <p className="text-gray-600 mb-4">
          Chúng tôi sẽ trả lại bạn trong thời gian sớm nhất
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Tên"
            className="w-full border p-2 rounded outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            className="w-full border p-2 rounded outline-none focus:border-blue-500"
          />
          <textarea
            placeholder="Bạn muốn chúng tôi trả lời gì nhỉ?"
            className="w-full border p-2 rounded h-32 outline-none focus:border-blue-500"
          ></textarea>
          <button className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-900">
            Send Message
          </button>
        </form>
      </div>

      <div className="rounded overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3043.4165109802493!2d105.79381013486778!3d20.98041817567868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acc508f938fd%3A0x883e474806a2d1f2!2zSOG7jWMgdmnhu4duIEvhu7kgdGh14bqtdCBt4bqtdCBtw6M!5e0!3m2!1svi!2sus!4v1749284459033!5m2!1svi!2sus"
          width="100%"
          height="100%"
          style={{ minHeight: "400px", border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-5">
            <i class="fas fa-map-marker-alt"></i>
            <p>Học Viện kĩ thuật mật mã</p>
        </div >
        <div className="flex items-center gap-5">
            <i class="fas fa-phone-alt"></i>
            <p>1234567899</p>
        </div>
        <div className="flex items-center gap-5">
            <i class="fas fa-paper-plane"></i>
            <p>qda@gmail.com</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
