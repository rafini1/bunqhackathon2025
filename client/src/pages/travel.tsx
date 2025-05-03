import React from "react";
import { ArrowLeftIcon, PlaneIcon, CarIcon, TrainIcon, MapPinIcon, CalendarIcon, SearchIcon } from "lucide-react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TravelPage() {
  return (
    <AppLayout>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <Link href="/">
            <a className="mr-3 p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              <ArrowLeftIcon className="h-4 w-4 text-white" />
            </a>
          </Link>
          <h1 className="text-2xl font-bold text-white">Travel</h1>
        </div>

        {/* Transport options */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-purple-600 to-blue-500 p-3 rounded-xl flex flex-col items-center justify-center">
            <PlaneIcon className="h-6 w-6 text-white mb-2" />
            <span className="text-xs text-white font-medium">Flights</span>
          </Card>
          <Card className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-xl flex flex-col items-center justify-center">
            <CarIcon className="h-6 w-6 text-white mb-2" />
            <span className="text-xs text-white font-medium">Cars</span>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl flex flex-col items-center justify-center">
            <TrainIcon className="h-6 w-6 text-white mb-2" />
            <span className="text-xs text-white font-medium">Trains</span>
          </Card>
        </div>

        {/* Search form */}
        <Card className="bg-gray-800 p-4 rounded-xl mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Find Flights</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center bg-gray-700 rounded-lg p-3">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
              <Input 
                placeholder="From" 
                className="bg-transparent border-0 p-0 text-white placeholder:text-gray-400 focus-visible:ring-0"
              />
            </div>
            
            <div className="flex items-center bg-gray-700 rounded-lg p-3">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
              <Input 
                placeholder="To" 
                className="bg-transparent border-0 p-0 text-white placeholder:text-gray-400 focus-visible:ring-0"
              />
            </div>
            
            <div className="flex items-center bg-gray-700 rounded-lg p-3">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
              <Input 
                placeholder="Dates" 
                className="bg-transparent border-0 p-0 text-white placeholder:text-gray-400 focus-visible:ring-0"
              />
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <SearchIcon className="h-4 w-4 mr-2" />
            Search Flights
          </Button>
        </Card>

        {/* Featured destinations */}
        <h2 className="text-lg font-semibold text-white mb-4">Popular Destinations</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="relative rounded-xl overflow-hidden h-40 bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 to-purple-600 opacity-90"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-white font-semibold">London</h3>
              <p className="text-gray-200 text-xs">From €59</p>
            </div>
          </Card>
          
          <Card className="relative rounded-xl overflow-hidden h-40 bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-blue-600 opacity-90"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-white font-semibold">Barcelona</h3>
              <p className="text-gray-200 text-xs">From €89</p>
            </div>
          </Card>
          
          <Card className="relative rounded-xl overflow-hidden h-40 bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-900 to-pink-600 opacity-90"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-white font-semibold">New York</h3>
              <p className="text-gray-200 text-xs">From €349</p>
            </div>
          </Card>
          
          <Card className="relative rounded-xl overflow-hidden h-40 bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-900 to-teal-600 opacity-90"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-white font-semibold">Tokyo</h3>
              <p className="text-gray-200 text-xs">From €499</p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}