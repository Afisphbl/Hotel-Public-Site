'use client';

import { createContext, useContext } from 'react';

export interface HotelInfo {
  id: string;
  name: string;
}

export const HotelContext_ = createContext<HotelInfo | null>(null);

export function useHotel() {
  return useContext(HotelContext_);
}
