//counters to determine which color's turn it is
var reds=0;
var greens=0;
//checks for lowest empty space on column clicked. 
//Ensures user can click any space & only correct is filled.
function checkEmpty(div){
  var empty=false;
  var clicked = $(div).attr('id');
  var idnum = parseInt(clicked.substr(6));
  while(idnum < 43){
    idnum = idnum + 7;
  }
  while(empty == false){
    for(var i = idnum; i>0; i = i - 7){
      idnumStr = i.toString();
      var checking = $('#square'+idnumStr);
      var str = checking.attr('class');
      empty = str.includes('empty');
      var divToFill = checking;
      if (empty){
        idnum = parseInt(idnumStr);
        break;
      } 
    }
  }
  return {
    divToFill: divToFill,
    idnum: idnum,
  };
}//end checkempty
//============================================================
//adds .red or .green to div to be filled
function addDisc(div){
  if(reds > greens){
    $(div).addClass('green');
    greens++;
  } else{
    $(div).addClass('red');
    reds++;
  };
  $(div).removeClass('empty');
}

function checkWin(color, square, i){

  function fourInARow(color, square, i){
    if($('#square'+i).hasClass(color)){
      win_count += 1;
      if(win_count == 4){
        return true;
      }
    }else{
      win_count = 0;
    }
  }

  
  function check_horiz_win(color,square){
    win_count = 0;
      for(i=square; i<square+7; i+=1){
        if(fourInARow(color, square, i)){
          return true;
        }
      }
   }//end check horiz win
 
  
  //vertical check
  var original_square = square;
  while(square>7){
    square -= 7;
  }
  for(i=square; i<50; i+=7){
    if(fourInARow(color, square, i)){
      return true;
    }
   }
  square = original_square; //reset square
  
  
  //horiz check
  left_squares = [1,7,15,22,29,36,43];
  in_array = jQuery.inArray(square, left_squares);

  if(in_array > -1){
    if(check_horiz_win(color, square)){
      return true;
    }
  }else{
    while (result = jQuery.inArray(square, left_squares)==-1){
      square -=1;
      if(result = jQuery.inArray(square, left_squares)!==-1){
        if(check_horiz_win(color, square)){
          return true;
        }
      }
    }
  }//end of horiz check


  //check for diagonal win
  win_count = 0; //reset win count for next check
  square = original_square; //reset square
  bottom_right_top_left_init = [];
  bottom_left_top_right_init = [];
  left_numbers = [1,8,15,22,29,36,43]; //numbers left edge
  right_numbers = [7,14,21,28,35,42,49]; //numbers right edge
  //===========================================================
  //check  bottom right - top left
  //create array of numbers to check
  for(i=square; i>0; i-=8){
    bottom_right_top_left_init.push(i); //add number to array
    if(result = jQuery.inArray(i, left_numbers)!==-1){
      break;
    }
  }
  for(i=square; i<50; i+=8){
    bottom_right_top_left_init.push(i); //add number to array
    if(result = jQuery.inArray(i, right_numbers)!==-1){
      break;
    }
  }
  //=============================================================
  square = original_square; //reset square
  bottom_right_top_left_init.push(square); //add number to array
  //func removes duplicate values from array
  var bottom_right_top_left  =
      bottom_right_top_left_init.filter(function(elem, pos){
        return bottom_right_top_left_init.indexOf(elem) == pos;
      });
  //func sorts array from lowest to highest
  bottom_right_top_left.sort(function(a,b){return a-b});
  //=======================================================
  //check from bottom left to top right
  for(i=square; i>0; i-=6){
    bottom_left_top_right_init.push(i); //add number to array
    if(result = jQuery.inArray(i, right_numbers)!==-1){
      break;
    }
  }
  for(i=square; i<50; i+=6){
    bottom_left_top_right_init.push(i); //add number to array
    if(result = jQuery.inArray(i, left_numbers)!==-1){
      break;
    }
  }
  //===========================================================
  square = original_square; //reset square
  //===========================================================
  bottom_left_top_right_init.push(square); //add number to array
  //func removes duplicate values from array
  var bottom_left_top_right = 
      bottom_left_top_right_init.filter(function(elem, pos){
        return bottom_left_top_right_init.indexOf(elem) == pos;
      });
  //func sorts array from lowest to highest
  bottom_left_top_right.sort(function(a,b){return a-b});
  //===========================================================
  square = bottom_right_top_left[0];
  //check for win from bottom right to top left
  for(i=0; i<bottom_right_top_left.length; i++){
    if(fourInARow(color, square, bottom_right_top_left[i])){
      return true;
    }
   }
  //===========================================================
  win_count=0; //reset win count for next check
  //===========================================================
  square = bottom_left_top_right[0];
  //check for winner from bottom left to top right
  for(i=0; i<bottom_left_top_right.length; i++){
    if(fourInARow(color, square, bottom_left_top_right[i])){
      return true;
    }
  }	
  return false; //no horizontal or vertical win found
}//end checkwin
//=====================================
function congratulate(color){
  if (color == "red"){
    alert("Red wins!");
    console.log("Red wins!");
  } else {
    alert("Yellow wins!");
    console.log("Yellow wins!");
  }
  var tiles = [16,17,18,19,20,30,31,32,33,34];
  //==========================================================
  setTimeout(function(){
    for(i=1; i<50; i++){
      var current = $('#square'+i);
      //empty all divs for victory message
      if(current.hasClass('red')){ 
        current.removeClass('red');
      } else if(current.hasClass('green')){
        current.removeClass('green');
      }
    }
    //place victory message
    for(i=0; i<10; i++){
      $('#square'+tiles[i]).html(letters[i]);
    }
  }, 500);
  //==========================================================
  setTimeout(function(){
    window.location=document.URL;
  }, 3000);
}//end of congratulate
//===========================================================
$(function(){
  var i=1;
  //add a numbered id to every game square
  $('.game-square').each(function(){
    $(this).attr('id', 'square'+i);
    i++;
    //add an on click event handler to every game square               //=======================================================
    //onclick functions
    $(this).on('click', function(){
      var results = checkEmpty(this); 
      var divToFill = results.divToFill;
      var idnum = results.idnum;
      addDisc(divToFill);
      if(reds>greens){
        var result = checkWin("red", idnum, i);
        if(result==true){
          congratulate('red');
        }
        }else{
        var result = checkWin("green", idnum, i);
        if(result==true){
          congratulate('green');
        }
      }
    })
  })
})