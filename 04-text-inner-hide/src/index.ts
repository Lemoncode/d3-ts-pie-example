import * as d3 from "d3";

interface Ventas {
  mes: string;
  ventas: number;
}

const ventas: Ventas[] = [
  { mes: "Enero", ventas: 120 },
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

// move to helper: http://plnkr.co/edit/3G0ALAVNACNhutOqDelk?p=preview&preview
function pointIsInArc(pt, ptData, d3Arc) {
  // Center of the arc is assumed to be 0,0
  // (pt.x, pt.y) are assumed to be relative to the center
  var r1 = constructorDePath.innerRadius()(ptData),
    r2 = constructorDePath.outerRadius()(ptData),
    theta1 = constructorDePath.startAngle()(ptData),
    theta2 = constructorDePath.endAngle()(ptData);

  var dist = pt.x * pt.x + pt.y * pt.y,
    angle = Math.atan2(pt.x, -pt.y);

  angle = angle < 0 ? angle + Math.PI * 2 : angle;

  return (
    r1 * r1 <= dist && dist <= r2 * r2 && theta1 <= angle && angle <= theta2
  );
}

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
  .style("font-size", 17)
  .each(function (d: any) {
    var bb = this.getBBox(),
      center = constructorDePath.centroid(<any>d);

    var topLeft = {
      x: center[0] + bb.x,
      y: center[1] + bb.y,
    };

    var topRight = {
      x: topLeft.x + bb.width,
      y: topLeft.y,
    };

    var bottomLeft = {
      x: topLeft.x,
      y: topLeft.y + bb.height,
    };

    var bottomRight = {
      x: topLeft.x + bb.width,
      y: topLeft.y + bb.height,
    };

    d.visible =
      pointIsInArc(topLeft, d, constructorDePath) &&
      pointIsInArc(topRight, d, constructorDePath) &&
      pointIsInArc(bottomLeft, d, constructorDePath) &&
      pointIsInArc(bottomRight, d, constructorDePath);
  })
  .style("display", function (d) {
    return d["visible"] ? null : "none";
  });

// TODO: about now showing label when there is not space
// http://plnkr.co/edit/3G0ALAVNACNhutOqDelk?p=preview&preview
// https://stackoverflow.com/questions/19792552/d3-put-arc-labels-in-a-pie-chart-if-there-is-enough-space
// https://stackoverflow.com/questions/14802600/preventing-text-clipping-in-d3-javascript-charting