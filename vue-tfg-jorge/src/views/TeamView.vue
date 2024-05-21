<template>
	<div class="grid-container">
	  <div class="block block1">
		<div class="block-title">
		  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
		  Block 1 - Defensas
		</div>
	  </div>
	  <div class="block block2">
		<div class="block-title">
		  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-280h80v-280h-80v280Zm160 0h80v-400h-80v400Zm160 0h80v-160h-80v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
		  Block 2 - Centrocampistas
		</div>
	  </div>
	  <div class="block block3">
		<div class="block-title">
		  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m160-419 101-101-101-101L59-520l101 101Zm540-21 100-160 100 160H700Zm-220-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-160q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640Zm0 40ZM0-240v-63q0-44 44.5-70.5T160-400q13 0 25 .5t23 2.5q-14 20-21 43t-7 49v65H0Zm240 0v-65q0-65 66.5-105T480-450q108 0 174 40t66 105v65H240Zm560-160q72 0 116 26.5t44 70.5v63H780v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5Zm-320 30q-57 0-102 15t-53 35h311q-9-20-53.5-35T480-370Zm0 50Z"/></svg>
		  Block 3 - Delanteros
		</div>
	  </div>
	  <div class="block block4">
		<div class="block-title">
		  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
		  Block 4 - Alineaciones
		</div>
	  </div>
	  <div class="block block5">
		<div class="block-title">
		  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"/></svg>
		  Block 5 - KPIs Grupales
		</div>
	  </div>
	</div>
</template>

<style scoped>
	.grid-container {
		display: grid;
		grid-template-areas: 
		"block1 block2 block3"
		"block1 block2 block3"
		"block4 block5 block5";
		grid-template-columns: 2fr 2fr 1fr;
		grid-template-rows: 1fr 1fr 1fr;
		gap: 30px;
		height: 100%;
		width: 100%;
		padding: 40px;
		box-sizing: border-box;
	}

	.block {
		background-color: #ffffff;
		color: rgb(0, 0, 0);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		padding: 20px;
		box-sizing: border-box;
		border-radius: 10px;
		border: 1px rgb(186, 185, 185) solid;
	}

	.block-title {
		display: flex;
		align-items: center;
		margin-bottom: 10px; /* Añade separación inferior */
	}

	.block-title svg {
		margin-right: 10px; /* Añade separación derecha del icono */
	}

	.block1{
		grid-area: block1;
	}
	.block2 {
		grid-area: block2;
	}
	.block3 {
		grid-area: block3;
	}
  	.block4 {
    	grid-area: block4;
  	}
  	.block5 {
		grid-area: block5;
	}

  @media (max-width: 600px) {
    .grid-container {
      grid-template-areas:
        "block1"
        "block2"
        "block3"
        "block4"
        "block5"
        "block6";
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }
  }
</style>