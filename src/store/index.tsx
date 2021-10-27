import create from "zustand";
import { Country as TCountry } from "@/model";
import { Country } from "@/api";

type State = {
  countries: TCountry[];
  getAllCountries: () => void;
  getCountryByName: (name: string) => void;
  getCountryBySubRegion: (subregion: string) => void;
};

export default create<State>((set, get) => ({
  countries: [],
  getAllCountries: async () => {
    // Fetch API to get data back
    Country.getAll().then((countries) => set({ countries }));
  },
  getCountryByName: async (name: string) => {
    // Fetch API by CountryName to get data back
    Country.getByName(name).then((countries) => set({ countries }));
  },
  getCountryBySubRegion: async (subregion: string) => {
    // Fetch API by CountryName to get data back
    Country.getBySubRegion(subregion).then((countries) => set({ countries }));
  },
}));
