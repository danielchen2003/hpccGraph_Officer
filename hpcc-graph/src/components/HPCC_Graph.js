import React, { useEffect, useState } from 'react'
import { Graph2, GraphReactT  } from "@hpcc-js/graph";
import { Palette } from "@hpcc-js/common";
import { Vertex4, CentroidVertex4 } from "@hpcc-js/react";

import "../styles/HPCC.css"
import testData from '../test_data_transactions.json'

const maxEdgeWidthSize = 20;

function HPCC_Graph() {

    const [transactionData, setTransactionData] = useState(testData);
    const [isInitialRender, setISInitialRender] = useState(false);


    const merchantNamesMap = new Map();
    const merchantTransactionsMap = new Map();
    const merchantCategoriesMap = new Map();
    const merchantDsTransactionType = new Map();


    const convertDataForHPCCGraph = (data) => { 
        //整理 json 表格理出逻辑
        var transactionsObject;
        for(var i in data){
            transactionsObject = data[i];
            

            var transactionsList = transactionsObject['transaction'];
            var currentTransaction;
            for(var j in transactionsList){
                currentTransaction = transactionsList[j];
                
                var transactionDetails = currentTransaction['_source'];
                
                if(!merchantTransactionsMap.get(transactionDetails['unique_id'])){
                    merchantTransactionsMap.set(transactionDetails['unique_id'], {merchant_name: transactionDetails['merchant_name'], amount: transactionDetails['transaction_amount'], linkTo: transactionDetails['merchant_category']})
                    
                    // merchant name setting conditions
                    //如果 商户有没这个 detail  merchant_name
                    if(!merchantNamesMap.get(transactionDetails['merchant_name'])){
                        merchantNamesMap.set(transactionDetails['merchant_name'], {noTransactions:1, zip: transactionDetails['merchant_zip'], state: transactionDetails['merchant_state'], city: transactionDetails['merchant_city'], address: transactionDetails['merchant_address'], type: "merchant_name", amount: transactionDetails['transaction_amount'], linkTo: transactionDetails['merchant_category'], transactionType: transactionDetails['transaction_type']})
                    }else{
                        //如果 商户有有这个 detail  merchant_name
                            if(merchantNamesMap.get(transactionDetails['merchant_name']).transactionType === transactionDetails['transaction_type']){
                                var oldValue = merchantNamesMap.get(transactionDetails['merchant_name']).amount;
                                var newValue = oldValue + transactionDetails['transaction_amount'];

                                var oldNoTransactions =  merchantNamesMap.get(transactionDetails['merchant_name']).noTransactions;
                                var newNoTransactions = oldNoTransactions + 1;

                                merchantNamesMap.set(transactionDetails['merchant_name'], {noTransactions:newNoTransactions, zip: transactionDetails['merchant_zip'], state: transactionDetails['merchant_state'], city: transactionDetails['merchant_city'], address: transactionDetails['merchant_address'], type: "merchant_name", amount: newValue, linkTo: transactionDetails['merchant_category'], transactionType: transactionDetails['transaction_type']});
                            }else{
                                continue
                            }
                    }

                    //merchant category setting conditions

                    var currentDateFromDataset = transactionDetails['transaction_date'];
                    var year = currentDateFromDataset.slice(0, 4)
                    var month = currentDateFromDataset.slice(4, 6);
                    var day = currentDateFromDataset.slice(6, 8)
                    var monthString = getMontOfInteger(month)


                    if(!merchantCategoriesMap.get(transactionDetails['merchant_category'])){
                        merchantCategoriesMap.set(transactionDetails['merchant_category'], {code: transactionDetails['merchant_category_code'], type: "merchant_category", amount: transactionDetails['transaction_amount'], linkTo: transactionDetails['ds_transaction_desc'], code: transactionDetails['merchant_category_code']})
                    }else{
                        var oldValue = merchantCategoriesMap.get(transactionDetails['merchant_category']).amount;
                        var newValue = oldValue + transactionDetails['transaction_amount'];

                        var oldMonths = merchantCategoriesMap.get(transactionDetails['merchant_category']).linkTo;
                        merchantCategoriesMap.set(transactionDetails['merchant_category'], {code: transactionDetails['merchant_category_code'], type: "merchant_category", amount: newValue, linkTo: transactionDetails['ds_transaction_desc'],  code: transactionDetails['merchant_category_code']})

                    }

                    if(!merchantDsTransactionType.get(transactionDetails['ds_transaction_desc'])){
                        merchantDsTransactionType.set(transactionDetails['ds_transaction_desc'], {code: transactionDetails['merchant_category_code'], type: "merchant_desc", amount: transactionDetails['transaction_amount'], linkTo: undefined})
                    }else{
                        var oldValue = merchantDsTransactionType.get(transactionDetails['ds_transaction_desc']).amount;
                        var newValue = oldValue + transactionDetails['transaction_amount'];

                        merchantDsTransactionType.set(transactionDetails['ds_transaction_desc'], {code: transactionDetails['merchant_category_code'], type: "merchant_desc", amount: newValue, linkTo: undefined})
                    }
                }

            }
        }
        console.log("======================================");

        // console.log(merchantNamesMap)
        // 
        // console.log(merchantCategoriesMap);
        console.log(merchantDsTransactionType)
        
        //map(17)
        //key key  "financial institutions :automated cash disbursements" => linmk to  ATM fee
        // value :-1727
        // linkTo ATM fee tree.next
        // type 指针 指向 merchant_category
        //2个value amout  code

        
        createDataAndEdges(merchantNamesMap);


    }

    const getIndexOfName = (array, name) => {
            var index = false
            for(var i in array){
                var currentElement = array[i];
                if(currentElement.name === name){
                    index = i
                    return index
                }
            }
            return 0
    }


    const createVertices = (currentMap, id = 0) => {
        return new Promise((resolve, reject) => {
            console.log(currentMap)
            var newData = [];
            for (let [name, value] of currentMap) {
                var nameText = `${name}`
                var categoryID = '0'
    
                var obj = {}
                obj.id = id;
                obj.text = nameText
                obj.linkTo = value.linkTo
                obj.name = name
                obj.type = value.type
                obj.amount = value.amount
                obj.noTransactions = value.noTransactions

                if(value.address){
                    obj.address = value.address
                }
                if(value.city){
                    obj.city = value.city
                }
                if(value.state){
                    obj.state = value.state
                }
                if(value.zip){
                    obj.zip = value.zip
                }
                if(value.code){
                    obj.code = value.code
                }


                newData.push(obj);

                id++;
            }
            resolve({newData, id})
        })
    } 


    const createData = (wholeDataArray) => {
        return new Promise ((resolve, reject) => {

            var newVertexesList = [];
            var newEdgesList = [];
            var maxNoTransactions = 0;

            for(var i in wholeDataArray){
                var currentElement = wholeDataArray[i];
                if(currentElement.noTransactions > maxNoTransactions){
                    maxNoTransactions = currentElement.noTransactions
                }
            }

            console.log(maxNoTransactions);
            var widthMultiplier = maxEdgeWidthSize / maxNoTransactions

            for(var i in wholeDataArray){
                var currentElement = wholeDataArray[i];
                var vertexObj = {};

                vertexObj.id = i;
                vertexObj.text = currentElement.text
                vertexObj.iconFontColor= "#ffffff";
                vertexObj.iconPadding = 52;
                vertexObj.shapeOffsetY = -55
                vertexObj.iconOffsetY = 1;
                vertexObj.annotations = [{
                    fill: "#555555",
                    stroke: "#555555",
                    textFill: "#ffffff",
                    imageChar: "12",
                    height: 16,
                    imageFontFamily: "Arial",
                    padding: 6,
                    xOffset: -1,
                    yOffset: 1
                }];


                var diameter = 40;
                if(currentElement.amount){
                    diameter = Math.abs((80 * currentElement.amount)/100);
                    if(diameter < 41){
                        diameter = 40;
                        vertexObj.iconFontSize = diameter
                    }else if(diameter > 100){
                        diameter = 100;
                        vertexObj.iconFontSize = diameter
                    }else{
                        diameter = diameter
                        vertexObj.iconFontSize = diameter
                    }
                }


                if(currentElement.type === ('merchant_name')){
                    vertexObj.centroid = false
                    vertexObj.iconText = "fa-credit-card"
                    vertexObj.iconBackgroundColor= "rgb(170, 7, 107)";
                    vertexObj.tooltip = `Merchant Name: ${currentElement.text} Merchant Address: ${currentElement.address} Merchant City: ${currentElement.city} Merchant State: ${currentElement.state} Merchnat Zip: ${currentElement.zip} Transaction Amount: ${currentElement.amount}`

                }
                if(currentElement.type === ('merchant_category')){
                    vertexObj.centroid = true
                    vertexObj.iconText = "fa-institution" 
                    vertexObj.iconBackgroundColor= "rgb(0, 167, 81)"
                    vertexObj.tooltip = `Merchant Code: ${currentElement.code} Merchant Category: ${currentElement.text} Transaction Amount: ${currentElement.amount}`
                    
                }
                if(currentElement.type === ('merchant_desc')){
                    vertexObj.centroid = true
                    vertexObj.iconText = "fa-money"
                    vertexObj.iconBackgroundColor= "rgb(24, 90, 157)"
                    vertexObj.tooltip = `Transaction Code: ${currentElement.code} Transaction Description: ${currentElement.text} Transaction Amount: ${currentElement.amount}`

                }
                if(currentElement.type === ('container')){
                    vertexObj.centroid = true
                    vertexObj.iconText = "fa-calendar"
                    vertexObj.iconBackgroundColor= "rgb(251, 215, 134)"
                }

                console.log((currentElement.noTransactions * 100) / maxNoTransactions)

                

                if(currentElement.linkTo){
                    var linkIndex = getIndexOfName(wholeDataArray, currentElement.linkTo);
                    var linkObj = {};
                    linkObj.id = i;
                    linkObj.source = wholeDataArray[linkIndex]
                    linkObj.target = wholeDataArray[i]
                    linkObj.strokeWidth  = currentElement.noTransactions * widthMultiplier
                    newEdgesList.push(linkObj)
                }else{
                    
                    var linkIndex = getIndexOfName(wholeDataArray, "2020");
                    var linkObj = {};
                    linkObj.id = i;
                    linkObj.source = wholeDataArray[linkIndex]
                    linkObj.target = wholeDataArray[i]
                    linkObj.strokeWidth  = currentElement.noTransactions * widthMultiplier

                    newEdgesList.push(linkObj)

                }


                newVertexesList.push(vertexObj);
            }

            console.log(newEdgesList)
            // console.log(newVertexesList)

            
            resolve({vertices: newVertexesList, edges: newEdgesList})
        })
    }

    const displayGraph = (rawData) => {

        new Graph2()
        .wasmFolder("/")
        .minScale(0.1)
        .layout("Hierarchy")
        .centroidRenderer(CentroidVertex4)
        .vertexRenderer(Vertex4)
        .tooltipWidth(220)
        .tooltipHeight(148)
        // .on("vertex_mousein", (vertex, col, sel, anno) => console.log("vertex_mousein", vertex, anno))
        // .on("vertex_mouseout", (vertex, col, sel, anno) => console.log("vertex_mouseout", vertex, anno))
        // .on("vertex_mouseover", (vertex, col, sel, anno) => console.log("vertex_mouseover", vertex, anno))
        .on("vertex_click", (vertex, col, sel, anno) => console.log("vertex_click", vertex, anno, col, sel))
        // .on("vertex_dblclick", (vertex, col, sel, anno) => console.log("vertex_dblclick", vertex, anno))
        .target("target")
        .data({
            vertices: rawData.vertices,
            edges: rawData.edges
        })
        .transitionDuration(200)
        .forceDirectedIterations(800)
        .forceDirectedLinkDistance(250)
        .forceDirectedAlphaDecay(0.014)
        .applyScaleOnLayout(true)
        .centroidColor("#00A000")
        .edgeArcDepth(0)
        .edgeStrokeWidth(4)
        .edgeColor("#227AC2")
        .render();

        
        setTimeout(() => {
            //document.getElementById('_w627').hidden = true
            document.getElementById('_w10').click();
        }, 500);
    }

    const createDataAndEdges = async (nameMap) => {

        // Generating the data for test
        var nameListObj = await createVertices(merchantNamesMap);
        var categoryList = await createVertices(merchantCategoriesMap, nameListObj.id);
        var transactionTypesList = await createVertices(merchantDsTransactionType, categoryList.id);



        var finalVertices = nameListObj.newData.concat(categoryList.newData, transactionTypesList.newData);
        //root
        finalVertices.push({
            id: transactionTypesList.id,
            text: '2020',
            categoryID: 2,
            amount: 40,
            linkTo: undefined,
            type: "container",
            name: "2020"
        })

        console.log(finalVertices)
        // Completing the data for test

        // Until here nothing is mandotory. If you have a list which has all the nodes that you want to display in the graph you can directly give it as argument to createData function. 
        // This function only expects for an array which has the neccessary information in each of its elements. 
        // an example array 

        const sample = [
            {
                "id": 0,
                "text": "Christopher Jones",
                "name": "Christopher Jones",
                "type": "merchant_name",
                "amount": 835.33
            },
            {
                "id": 1,
                "text": "Family Dollar",
                "linkTo": "variety stores",
                "name": "Family Dollar",
                "type": "merchant_name",
                "amount": -22.860000000000003
            },
            {
                "id": 2,
                "text": "Roku For Hulu Llc",
                "linkTo": "cable, satellite and other pay television and radio services",
                "name": "Roku For Hulu Llc",
                "type": "merchant_name",
                "amount": -1,
                "address": "816-2728107  Us"
            },
        ]

        // text is the text to be shown in the graph
        // linkTo is the 'name' property in the same list which the current node has connection to 
        // name is the name to be found when linking the elemenets
        // type can be used to give each data type specific colors/icons etc. can add more types inside of the createDataFunction
        // amount is the amount spent so far 
        // address, state, zip will be shown on hover


        var dataForHpccGraph = await createData(finalVertices);
        displayGraph(dataForHpccGraph)


    }




    const getMontOfInteger = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
      
        // 👇️ using visitor's default locale
        return date.toLocaleString([], {
          month: 'long',
        });
    }


    useEffect(() => {

        setISInitialRender(!isInitialRender);

    }, [])

    useEffect(() => {


        console.log(isInitialRender);
        if(isInitialRender){
            convertDataForHPCCGraph(transactionData);

        }
    }, [isInitialRender, transactionData])




  return (
    <div className="container">
        <div className='graph-container'>
            <div id="target" style={{"width": "100%", "height": "100vh"}} >

            </div>
        </div>
    </div>
  )
}

export default HPCC_Graph

