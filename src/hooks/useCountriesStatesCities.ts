import { useEffect, useState } from "react";
import axios from "axios";

interface ICountry {
  name: string;
}
interface IState {
  name: string;
}
interface ICity {
  name: string;
}

export const useCountriesStatesCities = (country?: string, state?: string) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const countriesApi = import.meta.env.VITE_COUNTRIES_API;
  const statesApi = import.meta.env.VITE_STATES_API;
  const citiesApi = import.meta.env.VITE_CITIES_API;

  useEffect(() => {
    axios
      .get(countriesApi)
      .then((res) =>
        setCountries(res.data.data.map((c: any) => ({ name: c.name })))
      )
      .catch((err) => console.error("Fetch countries failed:", err));
  }, []);

  useEffect(() => {
    if (!country) return setStates([]);
    setCities([]);
    axios
      .post(statesApi, { country })
      .then((res) =>
        setStates(res.data.data.states.map((s: any) => ({ name: s.name })))
      )
      .catch((err) => console.error("Fetch states failed:", err));
  }, [country]);

  useEffect(() => {
    if (!country || !state) return setCities([]);
    axios
      .post(citiesApi, { country, state })
      .then((res) => setCities(res.data.data.map((c: any) => ({ name: c }))))
      .catch((err) => console.error("Fetch cities failed:", err));
  }, [country, state]);

  return { countries, states, cities };
};
