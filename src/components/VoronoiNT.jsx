// Voronoi chart with normal text element tooltips

import React, { useEffect, useRef } from "react"
import { select, hierarchy, range, event } from "d3"
import { voronoiTreemap } from "d3-voronoi-treemap"
import seedrandom from "seedrandom"
import useResizeObserver from "./useResizeObserver"

const VoronoiNT = ({ data, kpiType, isLeading, isLagging, kpiSubCategory }) => {
  const svgRef = useRef()
  const wrapper = useRef()
  const dimensions = useResizeObserver(wrapper)

  useEffect(() => {
    const svg = select(svgRef.current)

    const { width, height } =
      dimensions || wrapper.current.getBoundingClientRect()

    const rotationMap = {
      Blue: 0,
      Pink: 177,
      Green: 269.5,
      Orange: 90,
    }

    const voronoi = svg
      .selectAll(".voronoi")
      .data([true])
      .join("g")
      .attr("class", "voronoi")

    const root = hierarchy(data).sum((node) => node.weight)

    const seed = seedrandom(20)

    const ellipse = range(100).map((i) => [
      (400 * (1 + 0.99 * Math.cos((i / 50) * Math.PI))) / 2,
      (400 * (1 + 0.99 * Math.sin((i / 50) * Math.PI))) / 2,
    ])

    const voronoiTreeMap = voronoiTreemap().prng(seed).clip(ellipse)

    voronoiTreeMap(root)

    const nodes = root
      .descendants()
      .sort((a, b) => b.depth - a.depth)
      .map((node, index) => ({ ...node, id: index }))

    const tooltip = select(".tooltip")
      .data([true])
      .join("text")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("opacity", 0)

    const fillOpacity = (node) => {
      const ancestor = node.parent && node.parent.ancestors()[2]
      const ancestorL1 = node.parent && node.parent.ancestors()[1]
      const kpiSubCategoryId = ancestorL1 && ancestorL1.data.name
      const leadOrLagId = node.depth === 4 && node.parent.data.id

      if (!ancestor) {
        return false
      }

      if (
        !isLeading &&
        !isLagging &&
        kpiSubCategory.length === 0 &&
        ancestor.data.name === kpiType &&
        node.depth === 4
      ) {
        return true
      }
      if (
        isLeading &&
        leadOrLagId === "Leading" &&
        kpiSubCategory.length === 0 &&
        ancestor.data.name === kpiType &&
        node.depth === 4
      ) {
        return true
      }
      if (
        isLeading &&
        leadOrLagId === "Leading" &&
        kpiSubCategory.includes(kpiSubCategoryId) &&
        ancestor.data.name === kpiType &&
        node.depth === 4
      ) {
        return true
      }
      if (
        isLagging &&
        leadOrLagId === "Lagging" &&
        kpiSubCategory.length === 0 &&
        ancestor.data.name === kpiType &&
        node.depth === 4
      ) {
        return true
      }
      if (
        isLagging &&
        leadOrLagId === "Lagging" &&
        kpiSubCategory.includes(kpiSubCategoryId) &&
        ancestor.data.name === kpiType &&
        node.depth === 4
      ) {
        return true
      }
      if (
        !isLeading &&
        !isLagging &&
        kpiSubCategory.includes(kpiSubCategoryId)
      ) {
        return true
      }
      return false
    }

    //return nodes;
    voronoi
      .selectAll("path")
      .data(nodes)
      .join("path")
      .attr("class", (node) => `node-${node.id}`)
      .attr("d", (node) => "M" + node.polygon.join("L") + "Z")
      .attr(
        "transform",
        "translate(200, 200) rotate(35.5) translate(-200, -200)"
      )
      .attr("fill", (node) => node.data.color)
      .attr("stroke", "#F5F5F2")
      .attr("stroke-width", 0)
      .attr("pointer-events", (node) => {
        return fillOpacity(node) ? "all" : "none"
      })
      .on("mouseenter", (node) => {
        const color = svg.selectAll(`.node-${node.id}`)
        color.attr("fill-opacity", 0.5)

        // Show tooltips on hover
        tooltip
          .style("opacity", 1)
          .text(node.data.kpi)
          .style("top", () =>
            event.pageY -
              (wrapper.current.getBoundingClientRect().y + window.scrollY) <=
            height / 2
              ? `${
                  height / 4 +
                  wrapper.current.getBoundingClientRect().y +
                  window.scrollY
                }px`
              : `${
                  height * (3 / 4) +
                  wrapper.current.getBoundingClientRect().y +
                  window.scrollY
                }px`
          )
          .style("left", () =>
            event.pageX - wrapper.current.getBoundingClientRect().x <= width / 2
              ? `${
                  width / 4 - 300 + wrapper.current.getBoundingClientRect().x
                }px`
              : `${
                  (width * 3) / 4 +
                  wrapper.current.getBoundingClientRect().x -
                  100
                }px`
          )
      })
      .on("mouseleave", (node) => {
        const color = svg.selectAll(`.node-${node.id}`)
        color.attr("fill-opacity", (node) => {
          return fillOpacity(node) ? 1 : 0.03
        })

        tooltip.style("opacity", 0)
      })
      .transition()
      .duration(1000)
      .attr("stroke-width", (node) => 7 - node.depth * 1.8)
      .attr("fill", (node) => node.data.color)
      .attr("fill-opacity", (node) => {
        return fillOpacity(node) ? 1 : 0.03
      })
      .attr("cursor", "default")

    voronoi
      .transition()
      .duration(1000)
      .attr("transform", `rotate(${rotationMap[kpiType]})`)
  }, [data, kpiType, isLeading, isLagging, kpiSubCategory, dimensions])

  return (
    <div ref={wrapper} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default VoronoiNT
