import React from "react";
import { Link } from "react-router-dom";
import { MdCancel } from "react-icons/md";

// A simple checkmark icon component to make the list look nice
const CheckIcon = () => (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);

const Premium = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 relative bg-blue-950 ">
      <Link
        to="/"
        className="top-6 left-6 absolute hover:text-neutral-500 transition-colors duration-200"
      >
        <MdCancel size="32px" />
      </Link>

      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8 mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-gray-400 text-lg">
            Enjoy a full premium experience, exclusive creator tools, top tier
            verification and security
          </p>
        </div>

        <div className=" grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card Section 2 */}
        <div className="bg-[#16181c] border border-gray-700 rounded-2xl p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-3xl font-bold">Basic</h2>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-extrabold mb-1">₹219</span>
            <span lassName="text-sm text-gray-500"> /Month</span>
          </div>

          {/* Features List */}
          <ul className="space-y-4 mb-10">
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">
                Small reply boost
              </span>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">
                Bookmark Folders
              </span>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">
                Highlights reply
              </span>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">Edit post</span>
            </li>
          </ul>
        </div>
        {/* Card Section  2*/}
        <div className="bg-[#16181c] border border-gray-700 rounded-2xl p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-3xl font-bold">Premium</h2>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-extrabold mb-1">₹650</span>
            <span lassName="text-sm text-gray-500"> /Month</span>
          </div>

          {/* Features List */}
          <ul className="space-y-4 mb-10">
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">
                All Basic features
              </span>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">
                Small Ads
              </span>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">
                Verified checkmark
              </span>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">Creator Tools</span>
            </li>
          </ul>
        </div>
        {/* Card Section 3 */}
        <div className="bg-[#16181c] border border-gray-700 rounded-2xl p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-3xl font-bold">Premium+</h2>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-extrabold mb-1">₹1,250</span>
            <span lassName="text-sm text-gray-500"> /Month</span>
          </div>

          {/* Features List */}
          <ul className="space-y-4 mb-10">
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">
                All Premium Features
              </span>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">
                No Ads
              </span>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">
                Access to Grok 4
              </span>
            </li>
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-3 text-gray-300 text-lg">Write Articles</span>
            </li>
          </ul>
        </div>
        
        </div>

        
      </div>
    </div>
  );
};

export default Premium;
