import React from 'react';

const ServiceDV = () => {
  return (
    <section className="mt-5 py-5 px-4">
      <div className="
        container mx-auto
        flex
        gap-6
        overflow-x-auto
        snap-x snap-mandatory
        pb-4
        px-2
        md:gap-8
        xl:grid xl:grid-cols-5 xl:gap-8
        xl:overflow-x-hidden xl:snap-none
      ">
        {[
          {
            icon: 'fas fa-truck',
            title: 'Free delivery',
            desc: 'Free Shipping for orders over $20',
          },
          {
            icon: 'fas fa-headset',
            title: 'Support 24/7',
            desc: '24 hours a day, 7 days a week',
          },
          {
            icon: 'fas fa-credit-card',
            title: 'Payment',
            desc: 'Pay with Multiple Credit Cards',
          },
          {
            icon: 'fas fa-thumbs-up',
            title: 'Reliable',
            desc: 'Trusted by thousands worldwide',
          },
          {
            icon: 'fas fa-user-check',
            title: 'Guarantee',
            desc: 'Within 30 days for an exchange',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="
              flex flex-shrink-0
              min-w-[280px]
              snap-start
              gap-4
              rounded-xl              // Giảm bo góc từ 2xl xuống xl
              p-5                      // Giảm padding
              items-center
              bg-white
              shadow-sm                // Giảm độ đổ bóng
              hover:shadow-md          // Hiệu ứng hover nhẹ hơn
              transition-shadow duration-300 ease-in-out // Chỉ áp dụng transition cho shadow

              group
              xl:min-w-0
              xl:col-span-1
              border border-gray-100   // Thêm viền nhẹ thay cho bóng đậm
            "
          >
            <i className={`${item.icon} fa-2x text-blue-500 group-hover:text-blue-600 transition-colors duration-300`}></i>

            <div className="text-gray-700">
              <h3 className="font-semibold text-base mb-1 group-hover:text-gray-800">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceDV;