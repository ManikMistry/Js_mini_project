var renderer_ = i2d.canvasLayer('#Mycanvas', {}, {});

// Created group element and translated the group by [renderer_.width/2, 200]
var g = renderer_.createEl({
  el: 'group',
  attr: {
    transform: {
      translate: [renderer_.width/2, 200]
    }
  }
});

let selectedtype;

// Function which gets triggered on click of radio button with chain Type as argument.
function onRadiobuttonClick (type) {
  selectedtype = type;
  // generating the hierarchical data.
  var data = DataGen({x:0,y:0, width: 100, p: {x: 0, y:0}});
  
  // Clearing existing elements if present.
  g.fetchEls('line').remove();
  g.fetchEls('circle').remove();
  
  // Clearing transitions if present.
  i2d.queue.clearAll();
  
  // render call.
  render(data);
}

// Default parallel call.
onRadiobuttonClick('parallel');

// For a given object, it creates Chain instance and for given childrens it creates Elements and adds the animateExe executables to the chain instance.
// and Triggers the chain execution. On completion of ever child transition, render method will be invoked recursively for the subsequent childrens.
function render (d) {
  // Based on selectedType, chain instance will be created.
  var chain = (selectedtype === 'parallel' ? i2d.chain.parallelChain() : i2d.chain.sequenceChain());
  
  // Creating Lines for childrens.
  g.createEls(d.children, {
    el: 'line',
    attr: {
      x1: d.x, y1: d.y,
      x2: d.x, y2: d.y
    },
    style: {
      lineWidth: 4,
      strokeStyle: '#ff3679'
    }
  }).forEach(function (da) {
    // every line animation executable is being added to the chain instance.
    chain.add(this.animateExe({
      duration: 1000,
      ease: 'easeInOutSin',
      attr: {
        x2: da.x,
        y2: da.y
      },
      end: function (d) {
         g.createEl({
              el: 'circle',
              attr: {
                cx: d.x, cy: d.y, r: 3
              },
              style: { fillStyle: 'white' }
         });
        
         // on end to the animation, trigger render method recursively to perform subsequent children animations.
         render(d);
      }
    }))
  });
  // chain execution starts.
  chain.start();
}


function DataGen (obj) {
  let child = [];
  if (obj.x === 0 && obj.y === 0 && obj.width > 25) {
    child.push(DataGen({x: obj.width, y: obj.width, width: obj.width, p: obj}))
    child.push(DataGen({x: -obj.width, y: obj.width, width: obj.width, p: obj}))
    child.push(DataGen({x: obj.width, y: -obj.width, width: obj.width, p: obj}))
    child.push(DataGen({x: -obj.width, y: -obj.width, width: obj.width, p: obj}))
  }
  if ((obj.x - obj.p.x) > 0 && (obj.y - obj.p.y) > 0 && obj.width > 10) {
    child.push(DataGen({x: (obj.x + obj.width / 2), y: (obj.y + obj.width / 2), width: obj.width / 2, p: obj}))
    child.push(DataGen({x: (obj.x - obj.width / 2), y: (obj.y + obj.width / 2), width: obj.width / 2, p: obj}))
    child.push(DataGen({x: (obj.x + obj.width / 2), y: (obj.y - obj.width / 2), width: obj.width / 2, p: obj}))
  }
  if ((obj.x - obj.p.x) < 0 && (obj.y - obj.p.y) < 0 && obj.width > 10) {
    child.push(DataGen({x: (obj.x - obj.width / 2), y: (obj.y - obj.width / 2), width: obj.width / 2, p: obj}))
    child.push(DataGen({x: (obj.x - obj.width / 2), y: (obj.y + obj.width / 2), width: obj.width / 2, p: obj}))
    child.push(DataGen({x: (obj.x + obj.width / 2), y: (obj.y - obj.width / 2), width: obj.width / 2, p: obj}))
  }
  if ((obj.x - obj.p.x) > 0 && (obj.y - obj.p.y) < 0 && obj.width > 10) {
    child.push(DataGen({x: (obj.x + obj.width / 2), y: (obj.y - obj.width / 2), width: obj.width / 2, p: obj}))
    child.push(DataGen({x: (obj.x - obj.width / 2), y: (obj.y - obj.width / 2), width: obj.width / 2, p: obj}))
    child.push(DataGen({x: (obj.x + obj.width / 2), y: (obj.y + obj.width / 2), width: obj.width / 2, p: obj}))
  }
  if ((obj.x - obj.p.x) < 0 && (obj.y - obj.p.y) > 0 && obj.width > 10) {
    child.push(DataGen({x: (obj.x - obj.width / 2), y: (obj.y + obj.width / 2), width: obj.width / 2, p: obj}))
    child.push(DataGen({x: (obj.x - obj.width / 2), y: (obj.y - obj.width / 2), width: obj.width / 2, p: obj}))
    child.push(DataGen({x: (obj.x + obj.width / 2), y: (obj.y + obj.width / 2), width: obj.width / 2, p: obj}))
  }
  
  obj.children = child;
  return obj;
}
