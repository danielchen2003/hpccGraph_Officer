import { Graph2 } from "@hpcc-js/graph";
import { CentroidVertex3, Vertex3 } from "@hpcc-js/react";
import React, { useEffect, useState } from 'react'
import { GraphReactT  } from "@hpcc-js/graph";
import { Palette } from "@hpcc-js/common";
import { Vertex4, CentroidVertex4 } from "@hpcc-js/react";


function RinGraph() {
  
  const vertices = [
    {
        id: 0,
        text: "JAKE MCKEE",
        centroid: true,
        icon: {
            imageChar: ""
        },
        subText: {
            text: "03/26/2020",
            textFill: "#555555"
        },
        annotationMeta: [
            greyAnno(10, 15, -5),
            dAnno(15, -4),
            exclamationAnno(15, -4),
        ],
        scale: 2
    },
    {
        id: 1,
        text: "123 Main St",
        icon: {
            imageChar: "",
        },
        subText: {
            text: "03/26/2020",
            textFill: "#555555"
        },
        annotationMeta: [
            greyAnno(13, 5, -1),
            exclamationAnno(),
        ]
    },
    {
        id: 2,
        text: "555-55-5555",
        icon: {
            imageChar: "",
        },
        subText: {
            text: "03/26/2020",
            textFill: "#555555"
        },
        annotationMeta: [
            greyAnno(8, 5, -1),
            exclamationAnno(),
        ]
    },
    {
        id: 3,
        text: "Jmckee@gmail.com",
        icon: {
            imageChar: ""
        },
        subText: {
            text: "03/26/2020",
            textFill: "#555555"
        },
        annotationMeta: [
            greyAnno(5, 5, -1),
            exclamationAnno(),
        ]
    },
    {
        id: 4,
        text: "303-123-1234",
        icon: {
            imageChar: ""
        },
        subText: {
            text: "03/26/2020",
            textFill: "#555555"
        },
        annotationMeta: [
            greyAnno(5, 5, -1),
            checkmarkAnno(),
        ]
    },
    {
        id: 5,
        text: "123039923",
        icon: {
            imageChar: "",
        },
        subText: {
            text: "03/26/2020",
            textFill: "#555555"
        },
        annotationMeta: [
            greyAnno(5, 5, -1),
            checkmarkAnno()
        ],
        scale: 2
    },
    {
        id: 6,
        text: "FL-2372-3982-9292-2929",
        icon: {
            imageChar: "",
        },
        subText: {
            text: "03/26/2020",
            textFill: "#555555"
        },
        annotationMeta: [
            greyAnno(5, 5, -1),
            checkmarkAnno(),
        ]
    },
    {
        id: 7,
        text: "11.12.3.301.31",
        icon: {
            imageChar: ""
        },
        subText: {
            text: "03/26/2020",
        },
        annotationMeta: [
            greyAnno(8, 5, -1),
            exclamationAnno(),
        ]
    },
];

function greyAnno(text, padding = 5, yOffset = -1) {
    return {
        text:  "fuck you",
        fill: "#555555",
        stroke: "#555555",
        textFill: "#ffffff",
        padding: padding,
        yOffset: yOffset
    };
}
function dAnno() {
    return {
        text: "you die",
        fill: "#ED1C24",
        stroke: "#ED1C24",
        textFill: "#ffffff",
        fontFamily: "Arial",
        padding: 15,
        yOffset: -4
    };
}
function exclamationAnno(padding, yOffset) {
    return {
        text: "asdsad",
        fill: "#ED1C24",
        stroke: "#ED1C24",
        textFill: "#ffffff",
        fontFamily: "Arial",
        padding: padding,
        yOffset: yOffset
    };
}
function checkmarkAnno(padding, yOffset) {
    return {
        text: "fffzzz",
        fill: "#00802B",
        stroke: "#00802B",
        textFill: "#ffffff",
        fontFamily: "'Font Awesome 5 Free'",
        padding: padding,
        yOffset: yOffset,
    };
}
const graphData = { vertices };
graphData.edges = vertices.slice(1).map((n, i) => {
  // console.log(n)
    return {
        id: i,
        source: graphData.vertices[0], //zhixiang yi
        target: graphData.vertices[i + 1], //mubiao +1 meiyige dou zhibian
        strokeWidth: i + 1
    };
});
const displayGraph = (graphData) => {
  console.log(graphData)
  
  const a = new Graph2()
      .centroidRenderer(CentroidVertex3)
      .vertexRenderer(Vertex3)
      .target("target")
      .edgeColor("#287EC4")
      .edgeStrokeWidth(2)
      .data(graphData)
      .centroidColor("#777777")
      .forceDirectedAlphaDecay(0.003)
      .layout("ForceDirected")
      .vertexIconFontFamily("FontAwesome")
      .edgeArcDepth(0)
      .zoomDuration(220)
      .zoomToFit(true)
      .zoomToFitLimit(55)
      .transitionDuration(0)    
      .render()
      
      console.log(a)
      
  }
  
    
  
  useEffect(() => {
    return () => {
    displayGraph(graphData)
    }
  },[])

  
  return (
    
      <div className="container">
          <div className='graph-container'>
              <div id="target" style={{"width": "100%", "height": "100vh"}} >
              
              </div>
          </div>
      </div>
    )
    
    }

export default RinGraph


