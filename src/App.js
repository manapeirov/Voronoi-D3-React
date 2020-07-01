import React, { Fragment, useState } from "react"
import "./App.css"
import { data } from "./assets/data.js"
import VoronoiNT from "./components/VoronoiNT"
import VoronoiAT from "./components/VoronoiAT"
import FilterButton from "./components/FilterButton"
import KpiToggleButton from "./components/KpiToggleButton"

function App() {
  const [kpiType, setKpiType] = useState(data.children[0].name)
  const [kpiIndex, setKpiIndex] = useState(null)
  const [isLeading, setIsLeading] = useState(null)
  const [isLagging, setIsLagging] = useState(null)
  const [kpiSubCategory, setKpiSubCategory] = useState([])

  return (
    <Fragment>
      <h1>TECH MULTIPLIER</h1>
      <div className="toggle-wrapper">
        <div className="voronoi-chart-buttons">
          {data.children.map((type) => (
            <KpiToggleButton
              className={"voronoi-chart-button"}
              showSecondaryStyle={kpiType === type.name}
              onClick={() => {
                setKpiType(type.name)
                setKpiIndex(type.numb)
                setKpiSubCategory([])
              }}
              title={type.name}
            />
          ))}
        </div>
        <div className="lead-lag-buttons">
          <FilterButton
            className={"lead-button"}
            showSecondaryStyle={isLeading}
            onClick={() => setIsLeading(!isLeading)}
            title={"Leading"}
          />
          <FilterButton
            className={"lag-button"}
            showSecondaryStyle={isLagging}
            onClick={() => setIsLagging(!isLagging)}
            title={"Lagging"}
          />
        </div>
      </div>
      <div className="kpiSubCategory-buttons">
        {kpiIndex !== null
          ? data.children[kpiIndex].children.map((category) => (
              <FilterButton
                className={"kpiSubCategory-button "}
                showSecondaryStyle={kpiSubCategory.includes(category.name)}
                onClick={() =>
                  kpiSubCategory.includes(category.name)
                    ? setKpiSubCategory(
                        kpiSubCategory.filter(
                          (entry) => entry !== category.name
                        )
                      )
                    : setKpiSubCategory([...kpiSubCategory, category.name])
                }
                title={category.name}
              />
            ))
          : data.children[0].children.map((category) => (
              <FilterButton
                className={"kpiSubCategory-button "}
                showSecondaryStyle={kpiSubCategory.includes(category.name)}
                onClick={() =>
                  kpiSubCategory.includes(category.name)
                    ? setKpiSubCategory(
                        kpiSubCategory.filter(
                          (entry) => entry !== category.name
                        )
                      )
                    : setKpiSubCategory([...kpiSubCategory, category.name])
                }
                title={category.name}
              />
            ))}
      </div>
      <VoronoiNT
        data={data}
        kpiType={kpiType}
        isLeading={isLeading}
        isLagging={isLagging}
        kpiSubCategory={kpiSubCategory}
      />
      <VoronoiAT
        data={data}
        kpiType={kpiType}
        isLeading={isLeading}
        isLagging={isLagging}
        kpiSubCategory={kpiSubCategory}
      />
    </Fragment>
  )
}

export default App
