import { useState } from 'react';
import { Calendar, Info, Bell, Heart, Shield, Activity, Users, FileText, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import fetalImage from '../assets/fetal/week-40.jpg';
import logo from '../assets/mamalogo.png';

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const dates = [20, 21, 22, 23, 24, 25, 26];

const insightCards = [
  {
    title: "Your baby's growth diary",
    bgColor: 'bg-pink-100',
    icon: '👶',
  },
  {
    title: "Pregnancy milestones",
    bgColor: 'bg-purple-100',
    icon: '🎯',
  },
  {
    title: "Health & Wellness",
    bgColor: 'bg-blue-100',
    icon: '💝',
  },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE5ED] to-white pb-20">
      {/* Header */}
      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <img src={logo} alt="MamaAlert" className="h-8" />
        <button className="p-2">
          <Calendar className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Date Display */}
      <div className="text-center py-2">
        <p className="text-gray-700">Nov 9, 2025</p>
      </div>

      {/* Week Calendar */}
      <div className="px-6 py-3">
        <div className="flex justify-between items-center">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <p className="text-xs text-gray-500 mb-2">{day}</p>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  dates[index] === 24
                    ? 'bg-white text-[#E85883] shadow-md'
                    : 'text-gray-600'
                }`}
              >
                {dates[index]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fetal Tracker Card */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-br from-[#FFD4E5] to-[#FFF0F5] rounded-3xl overflow-hidden shadow-lg">
          {/* Fetal Image */}
          <div className="flex justify-center items-center py-8 px-6">
            <img
              src={fetalImage}
              alt="Fetal development"
              className="w-64 h-64 object-contain"
            />
          </div>

          {/* Pregnancy Info */}
          <div className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <h2 className="text-2xl text-[#A0522D]">38 weeks, 1 day</h2>
              <Info className="w-5 h-5 text-[#A0522D]" />
            </div>
            <Button className="bg-white text-[#E85883] hover:bg-gray-50 rounded-full px-8 shadow-md">
              Details
            </Button>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="px-6 py-2">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
          <div className="flex-1">
            <h3 className="text-sm mb-1">🎉 Special Offer</h3>
            <p className="text-xs text-gray-700 mb-2">Get premium care features</p>
            <p className="text-xs text-gray-600">Claim your discount now!</p>
          </div>
          <div className="text-5xl opacity-20">🎁</div>
          <button className="absolute top-2 right-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
            ✕
          </button>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 py-3">
        <div className="w-2 h-2 rounded-full bg-gray-800"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>

      {/* My Daily Insights */}
      <div className="px-6 py-4">
        <h2 className="text-xl mb-4">My daily insights</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {insightCards.map((card, index) => (
            <Card
              key={index}
              className={`${card.bgColor} min-w-[140px] h-[160px] rounded-2xl border-0 p-4 flex flex-col`}
            >
              <p className="text-sm mb-auto">{card.title}</p>
              <div className="text-4xl opacity-50 mt-auto">{card.icon}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'today' ? 'text-[#E85883]' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Today</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'insights' ? 'text-[#E85883]' : 'text-gray-400'
            }`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs">Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'records' ? 'text-[#E85883]' : 'text-gray-400'
            }`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-xs">Health Records</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 relative ${
              activeTab === 'profile' ? 'text-[#E85883]' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
            {activeTab === 'profile' && (
              <div className="absolute -top-1 -right-1 flex gap-0.5">
                <div className="w-1.5 h-1.5 bg-[#E85883] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[#E85883] rounded-full"></div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
