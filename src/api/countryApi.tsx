import { Country as TCountry } from "@/model";
import { map, tap, memoizeWith, always, identity } from "ramda";
import { has, isObject, isString } from "@/utils";

const HOST = "https://restcountries.com/v3.1/";

function API(endpoint: string) {
  return String(new URL(endpoint, HOST));
}
function getNativeName(data: any): string[] {
  const results: string[] = [];
  if (!data) return results;
  for (const item of Object.values(data)) {
    if (isObject(item) && has("official", item) && isString(item.official)) {
      results.push(item.official);
    }
  }

  return results;
}
function getCurrencies(data: any): string[] {
  const result: string[] = [];

  if (!data) return result;

  for (const item of Object.values(data)) {
    if (
      isObject(item) &&
      has("name", item) &&
      isString(item.name)
      //
    ) {
      result.push(item.name);
    }
  }

  return result;
}

async function get(endpoint: string): Promise<TCountry[]> {
  return (
    fetch(API(endpoint))
      .then((res) => res.json())
      // .then(tap(console.log))
      .then(
        map<any, TCountry>((item) => ({
          name: item.name.common,
          nativeName: getNativeName(item.nativeName),
          flag: item.flags.png,
          population: item.population,
          capital: item.capital || [],
          region: item.region,
          subRegion: item.subregion || "",
          topLevelDomain: item.tld || [],
          currencies: getCurrencies(item.currencies),
          languages: Object.values(item.languages || []),
        }))
      )
  );
}

export const Country = {
  getAll: memoizeWith(always(""), () => get("all")),
  getByName: memoizeWith(identity, (name: string) => get(`name/${name}`)),
  getBySubRegion: memoizeWith(identity, (subregion: string) =>
    get(`subregion/${subregion}`)
  ),
};
