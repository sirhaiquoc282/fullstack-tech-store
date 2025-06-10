import React from 'react';

const ServiceDV = () => {
  return (
    <section className="mt-16  py-10 px-4 rounded-2xl">
      <div className="flex xl:grid xl:grid-cols-5 gap-4 overflow-x-auto snap-x snap-mandatory">
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
            className="flex min-w-[250px] xl:min-w-0 snap-start gap-4 border rounded-2xl p-6 items-center bg-white shadow hover:shadow-lg transition-all duration-300"
          >
            <i className={`${item.icon} fa-lg text-blue-600`}></i>
            <div className="text-gray-700">
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceDV;
