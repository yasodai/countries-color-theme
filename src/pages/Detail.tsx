import { Back, List, Flag, Tag } from "@/components";
import { Format } from "@/utils";
import clsx from "clsx";
import { useParams } from "react-router";
import useStore from "@/store";
import { join } from "ramda";
import { useEffect } from "react";

const format = join(", ");
export function Detail() {
  const { countryName } = useParams();

  const country = useStore((state) =>
    state.countries.find((country) =>
      country.name.match(RegExp(`^${countryName}`, "i"))
    )
  );
  const borderCountries = useStore((state) =>
    !country
      ? []
      : state.countries
          .filter(({ name }) => name !== countryName)
          .filter(({ subRegion }) =>
            subRegion.match(RegExp(`^${country.subRegion}`, "i"))
          )
          .map(({ name }) => name)
  );

  console.log(borderCountries);

  const getCountryByName = useStore((state) => state.getCountryByName);
  const getCountryBySubRegion = useStore(
    (state) => state.getCountryBySubRegion
  );

  useEffect(() => {
    if (!countryName || country) return;
    getCountryByName(countryName);
  }, [countryName, country, getCountryByName]);
  useEffect(() => {
    if (!country || borderCountries.length) return;
    getCountryBySubRegion(country.subRegion);
  }, [getCountryBySubRegion, country, borderCountries.length]);

  return (
    <div className="p-4 h-full flex flex-col justify-center">
      <div className="relative flex flex-col gap-8">
        <div
          className={clsx(
            "w-24",
            "lg:absolute top-0 lg:-translate-y-full lg:-my-20"
          )}
        >
          <Back />
        </div>

        {country && (
          <div
            className={clsx(
              "text-sm md:text-base",
              "flex flex-col lg:flex-row gap-8",
              "lg:min-h-[45vh]"
            )}
          >
            <div className="flex-1">
              <Flag
                style={{
                  aspectRatio: `${540 / 400}`,
                }}
                src={country.flag}
                name={country.name}
              />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {country.name}
              </h2>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col xl:flex-row gap-8">
                  <List
                    className="flex-1"
                    item={{
                      "Native Name": format(country.nativeName),
                      Population: Format.number(country.population),
                      Region: country.region,
                      "Sub Region": country.subRegion,
                      Capital: format(country.capital),
                    }}
                  />

                  <List
                    className="flex-1"
                    item={{
                      "Top Level Domain": format(country.topLevelDomain),
                      Currencies: format(country.currencies),
                      Languages: format(country.languages),
                    }}
                  />
                </div>

                <div
                  className={clsx(
                    "flex flex-col xl:flex-row xl:items-center gap-4"
                  )}
                >
                  <h3>Border Countries: </h3>

                  <ul className="grid grid-cols-3 gap-2 font-light text-xs">
                    {borderCountries.map((name) => (
                      <li key={name}>
                        <Tag
                          className="md:min-w-[8rem]"
                          href={`/detail/${encodeURI(name)}`}
                        >
                          {name}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detail;
