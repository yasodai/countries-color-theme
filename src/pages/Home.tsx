import { Link } from "react-router-dom";
import { Search, Select, Country, Card, VirtualList } from "@/components";
import clsx from "clsx";
import { FormEvent, useEffect, useState } from "react";
import useStore from "@/store";

const Regions = ["Africa", "America", "Asia", "Europe", "Oceania"];

export function Home() {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const countries = useStore((state) =>
    state.countries
      .filter((country) => country.region.match(RegExp(`^${filter}`, "i")))
      .filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
      )
  );
  const getAllCountries = useStore((state) => state.getAllCountries);

  useEffect(() => {
    // get countries
    getAllCountries();
  }, [getAllCountries]);

  function onChange(event: FormEvent<HTMLFormElement>) {
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );
    setFilter(Regions.includes(String(data.filter)) ? String(data.filter) : "");
    setSearch(String(data.search));
  }
  return (
    <form onChangeCapture={onChange}>
      <div className="flex flex-col md:flex-row md:h-14 gap-8 my-8 justify-between">
        <Card>
          <Search className="w-full lg:max-w-[32vw] py-2 " />
        </Card>

        <Select
          classes={{
            wrapper: "w-[12rem] sm:w-[20rem]",
          }}
          options={[
            { label: "Filter by Region", value: "Filter by Region" },
            ...Regions.map((label) => ({ label, value: label })),
          ]}
        />
      </div>

      <div className="hidden sm:block">
        <ul
          className={clsx(
            "-mx-4 px-4",
            "max-h-[68vh] overflow-auto",
            "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          )}
        >
          {countries.map((country) => (
            <li key={country.name}>
              <Link to={`/detail/${encodeURI(country.name)}`}>
                <Card>
                  <Country {...country} />
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sm:hidden">
        <VirtualList
          classes={{
            wrapper: "max-h-[68vh] px-10 md:p-0",
            list: "flex flex-col",
          }}
          list={countries}
          rowHeight={336}
          visibleCount={2}
          gap={40}
        >
          {(country) => (
            <Link to={`/detail/${encodeURI(country.name)}`}>
              <Card>
                <Country {...country} />
              </Card>
            </Link>
          )}
        </VirtualList>
      </div>
    </form>
  );
}

export default Home;
