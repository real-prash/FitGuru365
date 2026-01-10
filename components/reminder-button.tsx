"use client";

import { Button } from "@/components/ui/button";
import { Bell, Calendar } from "lucide-react";

export const ReminderButton = () => {
  
  const handleSetReminder = () => {
    // 1. Define Event Details
    const title = encodeURIComponent("Log Weight - FitGuru365");
    const details = encodeURIComponent("Time to update your progress! Log in here: https://fitguru365.vercel.app/dashboard"); // Replace with your actual domain later
    const location = encodeURIComponent("https://fitguru365.vercel.app");
    
    // 2. Set Time (Recurring Weekly)
    // We don't set specific dates so it defaults to "Next Available Slot" or Today
    // RRULE:FREQ=WEEKLY sets it to repeat
    const recurrence = "RRULE:FREQ=WEEKLY";
    
    // 3. Construct Google Calendar URL
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&recur=${recurrence}`;

    // 4. Open in new tab
    window.open(googleUrl, '_blank');
  };

  return (
    <Button 
      onClick={handleSetReminder}
      variant="outline"
      className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800"
    >
      <Bell size={16} />
      <span className="hidden sm:inline">Set Weekly Reminder</span>
      <span className="sm:hidden">Remind Me</span>
    </Button>
  );
};