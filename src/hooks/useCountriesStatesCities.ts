import { useEffect, useState } from "react";
import type { ICountry, IState, ICity } from "country-state-city/lib/interface";

export const useCountriesStatesCities = (countryCode?: string, stateCode?: string) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    import("country-state-city/lib/country").then((mod) => {
      const { getAllCountries } = mod.default;
      setCountries(getAllCountries().sort((a: ICountry, b: ICountry) => a.name.localeCompare(b.name)));
    });
  }, []);

  useEffect(() => {
    if (!countryCode) {
      setStates([]);
      return;
    }
    import("country-state-city/lib/state").then((mod) => {
      const { getStatesOfCountry } = mod.default;
      setStates(getStatesOfCountry(countryCode) || []);
    });
  }, [countryCode]);

  useEffect(() => {
    if (!countryCode || !stateCode) {
      setCities([]);
      return;
    }
    import("country-state-city/lib/city").then((mod) => {
      const { getCitiesOfState } = mod.default;
      setCities(getCitiesOfState(countryCode, stateCode) || []);
    });
  }, [countryCode, stateCode]);

  return { countries, states, cities };
};
