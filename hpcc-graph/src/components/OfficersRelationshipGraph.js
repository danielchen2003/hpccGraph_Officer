import React, { useEffect, useState } from 'react'
import { Graph2, GraphReactT  } from "@hpcc-js/graph";
import { Palette } from "@hpcc-js/common";
import { Vertex4, CentroidVertex4 } from "@hpcc-js/react";
import dummyData from '../test_data_officer.json'

import "../styles/HPCC.css"

function OfficersRelationshipGraph() {

  // const [graphData, setGraphData] = useState(null);

  
  
  function createVerticesAndEdges(data, i = 1) {
    const vertices = []
    const root = {id: 0,text: "ADWAIT JOSHI", company: "DATASEERS INC", Score: null,officer:"ADWAIT JOSHI"}
    vertices.push(root)
    
    
    for (const curentOfficerInfo of data) {
      let tempObj = {}
      if (curentOfficerInfo.company) {
        tempObj.text= curentOfficerInfo.company
      }
      tempObj.officer = curentOfficerInfo.officer ? curentOfficerInfo.officer  : null
      tempObj.Score = curentOfficerInfo.o ? curentOfficerInfo.officer  : null
      tempObj.id = i++
      
      vertices.push(tempObj)
    }
    const graphData = { vertices };
    
    graphData.edges = vertices.slice(1).map((n, i) => {
      return {
          id: i,
          source: graphData.vertices[0], //zhixiang yi
          target: graphData.vertices[i + 1], //mubiao +1 meiyige dou zhibian
          strokeWidth: i + 1
      };
  });
    
    return graphData
}
const graphData = createVerticesAndEdges(dummyData) 



console.log(graphData)




// const createVerticesAndEdges = (currentMap, id = 0) => {
//   return new Promise((resolve, reject) => {
    
//   })
// }
  
  useEffect(() => {
    return () => {
    createVerticesAndEdges(dummyData)
    displayGraph(graphData)
    }
  },[])
    
  
//   useEffect( ()=> {
//     console.log('my effect is running');
//     return () => console.log('my effect is destroying');
// }, []);

// do this:

  
  
//   const data = {
//     vertices: [
//         {id: 0,text: "ADWAIT JOSHI",Score: null,officer:"ADWAIT JOSHI", iconText :"fa-credit-card"},
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
        {id:0,imageChar:"fa-user"},
        {id:1,imageChar:"fa-building"}
    ])
    .data(rawData)
    .target("target")
    .layout("ForceDirected")
    .applyScaleOnLayout(true)
    .render()
    ;
  
} 

  
  
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