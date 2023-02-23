import React, { useEffect, useState } from 'react'
import { Graph2, GraphReactT  } from "@hpcc-js/graph";
import { Palette } from "@hpcc-js/common";
import { Vertex4, CentroidVertex4 } from "@hpcc-js/react";
import { CentroidVertex3, Vertex3 } from "@hpcc-js/react";
import dummyData from '../test_data_officer.json'

import "../styles/HPCC.css"

function OfficersRelationshipGraph() {

  // const [graphData, setGraphData] = useState(undefined);

  
  
  function createVerticesAndEdges(data, i = 1) {
    return new Promise((resolve, reject) => {
    const vertices = []
  //   const root = {id: 0,text: "ADWAIT JOSHI", company: "DATASEERS INC", score: undefined, officer:"ADWAIT JOSHI" , centroid :true ,iconText:"fa-institution", shapeOffsetY
  //   : -55 ,iconOffsetY: 1, iconPadding: 52, iconBackgroundColor : "rgb(0, 167, 81)",iconFontColor: "#ffffff", annotations : [{
  //     fill: "#555555",
  //     stroke: "#555555",
  //     textFill: "#ffffff",
  //     imageChar: "12",
  //     height: 16,
  //     imageFontFamily: "Arial",
  //     padding: 6,
  //     xOffset: -1,
  //     yOffset: 1
  // }]}

  //test categoryID: 0,textFontFamily: "monospace"
  const root = {id: 0,text: "ADWAIT JOSHI", company: "DATASEERS INC", score: undefined, officer:"ADWAIT JOSHI" , centroid :true ,categoryID: 0, textFontFamily: "monospace",  tooltip :`Merchant Name:  \n Merchant Address:  \n Merchant City: \n  Merchant State: ` ,
  annotations : [{
    fill: "#555555",
    stroke: "#555555",
    textFill: "#ffffff",
    imageChar: "12",
    height: 20,
    imageFontFamily: "Arial",
    padding: 6,
    xOffset: -1,
    yOffset: 1
}]}
  
  
  
    vertices.push(root)
    
    
    for (const curentOfficerInfo of data) {
      let tempObj = {}
      
      tempObj.text= curentOfficerInfo.company ?  curentOfficerInfo.company : undefined
      tempObj.officer = curentOfficerInfo.officer ? curentOfficerInfo.officer  : undefined
      tempObj.score = curentOfficerInfo.score ? curentOfficerInfo.score  : undefined
      tempObj.id = i++
      tempObj.tooltip = `Executive Name: ${curentOfficerInfo.officer ? curentOfficerInfo.officer  : ""}` + "\n" + `Company Name: ${  curentOfficerInfo.company ?  curentOfficerInfo.company: ''}` + "\n" + `Score: ${curentOfficerInfo.score ? curentOfficerInfo.score  : "" }`

      tempObj.categoryID = 1
      tempObj.annotations = [{
        fill: "#555555",
        stroke: "#555555",
        textFill: "#ffffff",
        imageChar: "12",
        height: 20,
        imageFontFamily: "Arial",
        padding: 6,
        xOffset: -1,
        yOffset: 1
    }]

      vertices.push(tempObj)
    }
    const graphData = { vertices };
    
    graphData.edges = vertices.slice(1).map((n, i) => {
      
      
      return {
          id: i,
          source: graphData.vertices[0], //zhixiang yi
          target: graphData.vertices[i + 1], //mubiao +1 meiyige dou zhibian
          strokeWidth: Math.ceil(graphData.vertices[i+1].score / 10 ) > 10 ? 10 : Math.ceil(graphData.vertices[i+1].score / 10 )
      };
  });
  resolve(graphData)
  })
    // return graphData
}





// const createVerticesAndEdges = (currentMap, id = 0) => {
//   return new Promise((resolve, reject) => {
    
//   })
// }
  
  
  
//   useEffect( ()=> {
//     console.log('my effect is running');
//     return () => console.log('my effect is destroying');
// }, []);

// do this:

  
  
//   const data = {
//     vertices: [
//         {id: 0,text: "ADWAIT JOSHI",Score: undefined,officer:"ADWAIT JOSHI", iconText :"fa-credit-card"},
//         {id: 1,text: "DATASEERS TECHNOLOGIES PRIVATE LIMITED (U72901MH2019FTC323491), India",score: 50, offier:"ADWAIT ASHOK JOSHI1" },
//         {id: 2,text: "	JOSHI OIL AND GAS PRIVATE LIMITED (U23200MH1998PTC115630), India" ,score: 80, offier:"ADWAIT AVINASH JOSHI" },
//         {id: 3,text: "HYGIENITY SOLUTIONS PRIVATE LIMITED (U74999PN2021PTC203096), India" ,score: 40, offier:"ADWAIT PRASAD JOSHI" },
        
//     ]
// }
  
// data.edges = [
//   {id: 0,source: data.vertices[1],target: data.vertices[0], strokeWidth:1 ,categoryID: 0 },
//   {id: 1,source: data.vertices[2],target: data.vertices[0] ,strokeWidth:4 , categoryID: 1},
//   {id: 2,source: data.vertices[3],target: data.vertices[0] ,strokeWidth:10 , categoryID: 1},
// ];
// console.log(data);

const displayGraph = (rawData) =>{
  
  
  

  
   new Graph2()
    
    .categories([
        {id:0,imageChar:"fa-user", imageCharFill: "#2ecc71"},
        {id:1,imageChar:"fa-building",imageCharFill: "#34495e"}
    ])
    .data({
      vertices: rawData.vertices,
      edges: rawData.edges
  })
    .centroidColor("#777777")
    .target("target")
    .layout("Neato")
    .minScale(0.6)
    .maxScale(1.2)
    .forceDirectedAlphaDecay(0.003)
    .centroidColor("#123214")
    .transitionDuration(0)
    .tooltipWidth(300)
    .vertexIconFontFamily("FontAwesome")
    .tooltipHeight(180)
    .allowDragging(false)
    // .graphOptions({})
    
    // .graphOptions.layout({
    //   fit: true,
    //   type: 'concentric',
    //   padding: 30
    // })
    
    // .zoomToFitLimit(115)
    // .edgeArcDepth(0)
    // .transitionDuration(0)
    .applyScaleOnLayout(true)
    .render()
    
  
} 

useEffect(() => {
  return  async () => {
  const graphData = await createVerticesAndEdges(dummyData)
  console.log(graphData)
  
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

export default  OfficersRelationshipGraph