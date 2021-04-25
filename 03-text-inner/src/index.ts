import * as d3 from "d3";

interface Ventas {
  mes: string;
  ventas: number;
}

const ventas: Ventas[] = [
  { mes: "Enero", ventas: 5000 },
  { mes: "Febrero", ventas: 2500 },
  { mes: "Marzo", ventas: 3000 },
];

const nombresMeses = ventas.map((venta) => venta.mes);

const color = d3
  .scaleOrdinal<string, string>()
  .domain(nombresMeses)
  .range(["#006A7B", "#008D54", "#659B91", "#00BC9F", "#006B5F"]);

const svgDimensions = { width: 400, height: 400 };
const margin = { left: 5, right: 5, top: 10, bottom: 10 };
const chartDimensions = {
  width: svgDimensions.width - margin.left - margin.right,
  height: svgDimensions.height - margin.bottom - margin.top,
};

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgDimensions.width)
  .attr("height", svgDimensions.height)
  .attr("style", "background-color: #FBFAF0");

const radio = Math.min(chartDimensions.width, chartDimensions.height) / 2;

const centroGrafica = {
  x: margin.left + chartDimensions.height / 2,
  y: margin.top + chartDimensions.width / 2,
};

var grupoGrafica = svg
  .append("g")
  .attr("width", chartDimensions.width)
  .attr("height", chartDimensions.height)
  .attr("transform", `translate(${centroGrafica.x}, ${centroGrafica.y})`);
const pieLayout = d3.pie<Ventas>().value(function (d) {
  return d.ventas;
});

var datosArcos = pieLayout(ventas);

const constructorDePath = d3.arc().innerRadius(0).outerRadius(radio);

grupoGrafica
  .selectAll("slice")
  .data(datosArcos)
  .enter()
  .append("path")
  .attr("d", <any>constructorDePath)
  .attr("fill", function (d) {
    return color(d.data.mes);
  });

grupoGrafica
  .selectAll("slice")
  .data(datosArcos)
  .enter()
  .append("text")
  .attr("d", <any>constructorDePath)
  .text(function (d) {
    return d.data.mes;
  })
  .attr("transform", function (d) {
    const datos = constructorDePath.centroid(<any>d);
    const x = Math.trunc(datos[0]);
    const y = Math.trunc(datos[1]);
    const command = `translate(${x}, ${y})`; //`translate(${x}, ${y})`;
    console.log(command);
    return command;
  })
  .style("text-anchor", "middle")
  .style("font-size", 17);
