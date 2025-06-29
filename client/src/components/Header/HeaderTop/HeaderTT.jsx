import React from 'react'

const HeaderTT = () => {
  return (
    <div>
      <div className="flex gap-1">
              {/* <div>
                <img  alt="helpphone" />
              </div> */}
              <div className=' hidden xl:block '>
                <span>Call us now: </span>
                <span className="text-[#FF3D3D]">1234567899</span>
                <br />
                <span>Email: </span>
                <span className="text-[#004EC3]">qad@support.com</span>
              </div>
            </div>
    </div>
  )
}

export default HeaderTT
