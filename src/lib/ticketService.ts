
import { TicketCategory } from "@/contexts/TicketContext";

// Utility functions for ticket operations
export const formatTicketNumber = (number: number): string => {
  return `BM-${number.toString().padStart(5, '0')}`;
};

export const getCategoryIcon = (category: TicketCategory): string => {
  switch (category) {
    case "network":
      return "wifi";
    case "laptop":
      return "laptop";
    case "software":
      return "code";
    default:
      return "help-circle";
  }
};

export const getCategoryName = (category: TicketCategory): string => {
  switch (category) {
    case "network":
      return "Network Issue";
    case "laptop":
      return "Hardware Issue";
    case "software":
      return "Software Issue";
    default:
      return "Unknown Issue";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "open":
      return "bg-ticket-pending text-white";
    case "in-progress":
      return "bg-ticket-warning text-white";
    case "resolved":
      return "bg-ticket-success text-white";
    case "closed":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

// Form validation
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateDescription = (description: string): boolean => {
  return description.trim().length >= 10;
};
