(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw ((f.code = "MODULE_NOT_FOUND"), f);
      }
      var l = (n[o] = { exports: {} });
      t[o][0].call(
        l.exports,
        function (e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        },
        l,
        l.exports,
        e,
        t,
        n,
        r,
      );
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})(
  {
    1: [
      function (require, module, exports) {
        (function (global) {
          /*  Chase Miller (2015-2016) */

          // Grab an existing iobio namespace object, or create a blank object
          // if it doesn't exist
          var iobio = global.iobio || {};
          global.iobio = iobio;

          // export if being used as a node module - needed for test framework
          if (typeof module === "object") {
            module.exports = iobio;
          }

          // Add visualizations
          iobio.viz = require("./viz/viz.js");

          // Add layouts
          iobio.viz.layout = require("./layout/layout.js");

          // Add shapes
          iobio.viz.svg = require("./svg/svg.js");

          // Add utils
          iobio.viz.utils = require("./utils.js");
        }).call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
                ? window
                : {},
        );
      },
      {
        "./layout/layout.js": 5,
        "./svg/svg.js": 9,
        "./utils.js": 11,
        "./viz/viz.js": 26,
      },
    ],
    2: [
      function (require, module, exports) {
        var hasOwn = Object.prototype.hasOwnProperty;
        var toStr = Object.prototype.toString;
        var undefined;

        var isArray = function isArray(arr) {
          if (typeof Array.isArray === "function") {
            return Array.isArray(arr);
          }

          return toStr.call(arr) === "[object Array]";
        };

        var isPlainObject = function isPlainObject(obj) {
          "use strict";
          if (!obj || toStr.call(obj) !== "[object Object]") {
            return false;
          }

          var has_own_constructor = hasOwn.call(obj, "constructor");
          var has_is_property_of_method =
            obj.constructor &&
            obj.constructor.prototype &&
            hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
          // Not own constructor property must be Object
          if (
            obj.constructor &&
            !has_own_constructor &&
            !has_is_property_of_method
          ) {
            return false;
          }

          // Own properties are enumerated firstly, so to speed up,
          // if last one is own, then all properties are own.
          var key;
          for (key in obj) {
          }

          return key === undefined || hasOwn.call(obj, key);
        };

        module.exports = function extend() {
          "use strict";
          var options,
            name,
            src,
            copy,
            copyIsArray,
            clone,
            target = arguments[0],
            i = 1,
            length = arguments.length,
            deep = false;

          // Handle a deep copy situation
          if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
          } else if (
            (typeof target !== "object" && typeof target !== "function") ||
            target == null
          ) {
            target = {};
          }

          for (; i < length; ++i) {
            options = arguments[i];
            // Only deal with non-null/undefined values
            if (options != null) {
              // Extend the base object
              for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                  continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (
                  deep &&
                  copy &&
                  (isPlainObject(copy) || (copyIsArray = isArray(copy)))
                ) {
                  if (copyIsArray) {
                    copyIsArray = false;
                    clone = src && isArray(src) ? src : [];
                  } else {
                    clone = src && isPlainObject(src) ? src : {};
                  }

                  // Never move original objects, clone them
                  target[name] = extend(deep, clone, copy);

                  // Don't bring in undefined values
                } else if (copy !== undefined) {
                  target[name] = copy;
                }
              }
            }
          }

          // Return the modified object
          return target;
        };
      },
      {},
    ],
    3: [
      function (require, module, exports) {
        var box = function () {
          // Defaults
          var value = function (d) {
              return +d;
            },
            quartiles = function (d) {
              return [
                d3.quantile(d, 0.25),
                d3.quantile(d, 0.5),
                d3.quantile(d, 0.75),
              ];
            },
            whiskers = function (d) {
              return [0, d.length - 1];
            },
            includeData = true,
            includeOutliers = true,
            modifiedBoxPlot = true;

          function layout(data) {
            // Sort data and Compute the numeric values for each data element.
            data = data.sort(function (i, j) {
              return value(j) - value(i);
            });
            var values = data.map(function (d, i) {
              return value.call(this, d, i);
            });

            // Compute quartiles
            var quartileData = quartiles.call(this, values),
              q1 = quartileData[2],
              q3 = quartileData[0],
              iqr = (q3 - q1) * 1.5;

            // if modified box plot, then use iqr to determine outliers
            if (modifiedBoxPlot) {
              var outliers = [];
              var filtered = [];
              values.forEach(function (d) {
                if (d >= q1 - iqr && d <= q3 + iqr) filtered.push(d);
                else outliers.push(d);
              });
              values = filtered;
            }

            // Compute whiskers. Must return exactly 2 elements, or null.
            var whiskerIndices = whiskers && whiskers.call(this, values),
              whiskerData =
                whiskerIndices &&
                whiskerIndices.map(function (i) {
                  return +values[i];
                });

            var boxData = {
              quartiles: quartileData,
              whiskers: whiskerData,
            };
            if (includeOutliers) boxData.outliers = outliers || [];
            if (includeData) boxData.data = data;

            return boxData;
          }

          /*
           * Specifies the value function, which returns a nonnegative numeric value
           * for each datum. The default value function is `return d`. The value function
           * is passed two arguments: the current datum and the current index.
           */
          layout.value = function (_) {
            if (!arguments.length) return value;
            value = _;
            return layout;
          };

          /*
           * Boolean for including the data in the final product or not
           */
          layout.includeData = function (_) {
            if (!arguments.length) return includeData;
            includeData = _;
            return layout;
          };

          /*
           * Boolean for including the outliers in the final product or not
           */
          layout.includeOutliers = function (_) {
            if (!arguments.length) return includeOutliers;
            includeOutliers = _;
            return layout;
          };

          /*
           * A modified box plot uses the interquartile range to determine the whisers.
           * A standard box plot defines the whiskers by the max and min value.
           * Default: true
           */
          layout.modifiedBoxPlot = function (_) {
            if (!arguments.length) return modifiedBoxPlot;
            modifiedBoxPlot = _;
            return layout;
          };

          /*
           * Specifies how the quartiles are calculated
           *
           */
          layout.quartiles = function (_) {
            if (!arguments.length) return quartiles;
            quartiles = _;
            return layout;
          };

          return layout;
        };

        module.exports = box;
      },
      {},
    ],
    4: [
      function (require, module, exports) {
        var utils = require("../utils.js");

        var graph = function () {
          // Defaults
          var sources = function (d) {
              return d.sources;
            },
            targets = function (d) {
              return d.targets;
            },
            position = function (d) {
              return d.position;
            };

          function layout(root) {
            var nodes = [];
            var visited = {};
            var uid = utils.getUID();
            var stack = [root];
            while ((node = stack.pop()) != null) {
              if (node._visited == uid) continue;
              nodes.push(node);
              // mark as visited
              node._visited = uid;
              // see if multiple variants at this position
              var v = visited[position(node)] || (visited[position(node)] = []);
              v.push(node);
              if (v.length == 1) node.y = 0;
              else
                for (var i = 0; i < v.length; i++) {
                  v[i].y = (i / (v.length - 1) || 0) * 2 - 1;
                }

              // push unvisited neighbors on stack
              var neighbors = [].concat(sources(node), targets(node));
              stack = stack.concat(
                neighbors.filter(function (a) {
                  return a._visited != uid;
                }),
              );
            }
            return nodes;
          }

          /*
           * Identifies the links between all nodes
           */
          layout.links = function (nodes) {
            var links = [];
            nodes.forEach(function (node) {
              (node.targets || []).map(function (target) {
                links.push({
                  source: node,
                  target: target,
                });
              });
            });
            return links;
          };

          /*
           * Specifies the value function *sources*, which returns an array of node objects
           * for each datum. The default value function is `return sources`. The value function
           * is passed two arguments: the current datum and the current index.
           */
          layout.sources = function (_) {
            if (!arguments.length) return sources;
            sources = _;
            return chart;
          };

          /*
           * Specifies the value function *targets*, which returns an array of node objects
           * for each datum. The default value function is `return targets`. The value function
           * is passed two arguments: the current datum and the current index.
           */
          layout.targets = function (_) {
            if (!arguments.length) return targets;
            targets = _;
            return chart;
          };

          /*
           * Specifies the value function *position*, which returns a nonnegative numeric value
           * for each datum. The default value function is `return position`. The value function
           * is passed two arguments: the current datum and the current index.
           */
          layout.position = function (_) {
            if (!arguments.length) return position;
            position = _;
            return chart;
          };
          // TODO: do these functions still make sense?
          // layout.size = function(x) {
          //   if (!arguments.length) return nodeSize ? null : size;
          //   nodeSize = (size = x) == null ? sizeNode : null;
          //   return tree;
          // };
          // layout.nodeSize = function(x) {
          //   if (!arguments.length) return nodeSize ? size : null;
          //   nodeSize = (size = x) == null ? null : sizeNode;
          //   return tree;
          // };
          return layout;
        };

        module.exports = graph;
      },
      { "../utils.js": 11 },
    ],
    5: [
      function (require, module, exports) {
        var layout = {};
        // add layouts
        layout.pileup = require("./pileup.js");
        layout.graph = require("./graph.js");
        layout.pointSmooth = require("./pointSmooth.js");
        layout.outlier = require("./outlier.js");
        layout.box = require("./box.js");

        module.exports = layout;
      },
      {
        "./box.js": 3,
        "./graph.js": 4,
        "./outlier.js": 6,
        "./pileup.js": 7,
        "./pointSmooth.js": 8,
      },
    ],
    6: [
      function (require, module, exports) {
        var outlier = function () {
          // Defaults
          var value = function (d) {
              return d[0];
            },
            count = function (d) {
              return d[1];
            };

          function layout(data) {
            var realMin = d3.min(data, function (d, i) {
              return value(d);
            });
            var realMax = d3.max(data, function (d, i) {
              return value(d);
            });
            var max = Math.abs(realMin) + Math.abs(realMax);

            var scale = d3.scale
              .linear()
              .domain([realMin, realMax])
              .range([0, max]);

            data = data.sort(function (aItem, bItem) {
              var a = value(aItem);
              var b = value(bItem);
              return a > b ? 1 : a < b ? -1 : 0;
            });

            var q1 = quantile(data, scale, 0.25);
            var q3 = quantile(data, scale, 0.75);
            var iqr = (q3 - q1) * 1.5; //

            var filteredData = data.filter(function (d) {
              return (
                scale(value(d)) >= Math.max(q1 - iqr, 0) &&
                scale(value(d)) <= q3 + iqr
              );
            });

            return filteredData;
          }

          /*
           * Determines quantile of array with given p
           */
          function quantile(arr, scale, p) {
            var length =
              arr.reduce(function (previousValue, currentValue, index, array) {
                return previousValue + count(currentValue);
              }, 0) - 1;
            var H = length * p + 1,
              h = Math.floor(H);

            var hValue,
              hMinus1Value,
              currValue = 0;
            for (var i = 0; i < arr.length; i++) {
              currValue += count(arr[i]);
              if (hMinus1Value == undefined && currValue >= h - 1)
                hMinus1Value = scale(value(arr[i]));
              if (hValue == undefined && currValue >= h) {
                hValue = scale(value(arr[i]));
                break;
              }
            }
            var v = +hMinus1Value,
              e = H - h;
            return e ? v + e * (hValue - v) : v;
          }

          /*
           * Specifies the value function *value*, which returns a nonnegative numeric value
           * for each datum. The default value function is `return d[0]`. The value function
           * is passed two arguments: the current datum and the current index.
           */
          layout.value = function (_) {
            if (!arguments.length) return value;
            value = _;
            return layout;
          };

          /*
           * Specifies the value function *count*, which returns a nonnegative numeric value
           * for each datum. The default value function is `return d[1]`. The value function
           * is passed two arguments: the current datum and the current index.
           */
          layout.count = function (_) {
            if (!arguments.length) return count;
            count = _;
            return layout;
          };

          return layout;
        };

        module.exports = outlier;
      },
      {},
    ],
    7: [
      function (require, module, exports) {
        var pileup = function () {
          // Defaults
          var startValue = function (d) {
              return d.start;
            },
            endValue = function (d) {
              return d.end;
            },
            sort = "default",
            size = 400,
            buffer = 0;

          function layout(data) {
            // Compute the numeric values for each data element.
            var values = data.map(function (d, i) {
              return [
                +startValue.call(layout, d, i),
                +endValue.call(layout, d, i),
              ];
            });
            var xScale = d3.scale
              .linear()
              .domain([values[0][0], values[values.length - 1][1]])
              .range([0, size]);

            // Optionally sort the data.
            var index = d3.range(data.length);
            if (sort != null)
              index.sort(
                sort === "default"
                  ? function (i, j) {
                      return values[j][0] - values[i][0];
                    }
                  : function (i, j) {
                      return sort(data[i], data[j]);
                    },
              );

            // Compute the piles!
            // They are stored in the original data's order.
            // TODO: handle widhts that are less than a pixel
            var step;
            var piles = [];
            var furthestRight = [];

            // initialize piles
            var currPile = [];
            var prevPile = [];
            var prevPrevPile = [];

            // initialize indices
            var prevPileIndex = 1;

            index.forEach(function (i) {
              var start = values[i][0];
              var end = values[i][1];
              step = undefined;

              for (var k = 0; k < furthestRight.length; k++) {
                if (xScale(furthestRight[k]) + buffer < xScale(start)) {
                  step = k;
                  furthestRight[k] = end;
                  break;
                }
              }

              if (step == undefined) {
                step = furthestRight.length;
                furthestRight.push(end);
              }

              piles[i] = {
                data: data[i],
                x: start,
                w: end - start,
                y: step,
              };
            });
            return piles;
          }

          /*
           * Specifies the value function *start*, which returns a nonnegative numeric value
           * for each datum. The default value function is `return start`. The value function
           * is passed two arguments: the current datum and the current index.
           */
          layout.start = function (_) {
            if (!arguments.length) return startValue;
            startValue = _;
            return layout;
          };

          /*
           * Specifies the value function *end*, which returns a nonnegative numeric value
           * for each datum. The default value function is `return end`. The value function
           * is passed two arguments: the current datum and the current index.
           */
          layout.end = function (_) {
            if (!arguments.length) return endValue;
            endValue = _;
            return layout;
          };

          /*
           * Specifies the x scale for the layout. This is necessary to accurately predict
           * which features will overlap in pixel space.
           */
          layout.size = function (_) {
            if (!arguments.length) return size;
            size = _;
            return layout;
          };

          /*
           * Specifies the buffer needed between features to not be considered an overlap
           */
          layout.buffer = function (_) {
            if (!arguments.length) return buffer;
            buffer = _;
            return layout;
          };

          /*
           * Specifies the sort function to be used or null if no sort
           */
          layout.sort = function (_) {
            if (!arguments.length) return sort;
            sort = _;
            return layout;
          };

          return layout;
        };

        module.exports = pileup;
      },
      {},
    ],
    8: [
      function (require, module, exports) {
        var pointSmooth = function () {
          // Defaults
          var pos = function (d) {
              return d.pos;
            },
            depth = function (d) {
              return d.depth;
            },
            size = 400;
          epsilonRate = 0.3;

          function layout(data) {
            // Compute the numeric values for each data element and keep original data.
            var points = data.map(function (d, i) {
              return {
                data: d,
                pos: +pos.call(layout, d, i),
                depth: +depth.call(layout, d, i),
              };
            });

            var epislon = parseInt(
              (epsilonRate * (points[points.length - 1].pos - points[0].pos)) /
                size,
            );

            // Compute the points!
            // They are stored in the original data's order.
            points = properRDP(points, epislon);

            return points;
          }

          /*
           * Specifies the value function *pos*, which returns a nonnegative numeric value
           * for each datum. The default value function is `return pos`. The value function
           * is passed two arguments: the current datum and the current index.
           */
          layout.pos = function (_) {
            if (!arguments.length) return pos;
            pos = _;
            return layout;
          };

          /*
           * Specifies the value function *depth*, which returns a nonnegative numeric value
           * for each datum. The default value function is `return depth`. The value function
           * is passed two arguments: the current datum and the current index.
           */
          layout.depth = function (_) {
            if (!arguments.length) return depth;
            depth = _;
            return layout;
          };

          /*
           * Specifies the x scale for the layout. This is necessary to accurately predict
           * how smoothing will be necessary i.e. smaller size has less resolution and will
           * require more smoothing.
           */
          layout.size = function (_) {
            if (!arguments.length) return size;
            size = _;
            return layout;
          };

          /*
           * Specifies the epislon rate to determine the aggressiveness of the smoothing
           */
          layout.epsilonRate = function (_) {
            if (!arguments.length) return epsilonRate;
            epsilonRate = _;
            return layout;
          };

          return layout;
        };

        module.exports = pointSmooth;

        /*
         * properRDP
         *
         * @licence Feel free to use it as you please, a mention of my name is always nice.
         *
         * Marius Karthaus
         * http://www.LowVoice.nl
         *
         */

        function properRDP(points, epsilon) {
          var firstPoint = points[0];
          var lastPoint = points[points.length - 1];
          if (points.length < 3) {
            return points;
          }
          var index = -1;
          var dist = 0;
          for (var i = 1; i < points.length - 1; i++) {
            var cDist = findPerpendicularDistance(
              points[i],
              firstPoint,
              lastPoint,
            );
            if (cDist > dist) {
              dist = cDist;
              index = i;
            }
          }
          if (dist > epsilon) {
            // iterate
            var l1 = points.slice(0, index + 1);
            var l2 = points.slice(index);
            var r1 = properRDP(l1, epsilon);
            var r2 = properRDP(l2, epsilon);
            // concat r2 to r1 minus the end/startpoint that will be the same
            var rs = r1.slice(0, r1.length - 1).concat(r2);
            return rs;
          } else {
            return [firstPoint, lastPoint];
          }
        }

        function findPerpendicularDistance(p, p1, p2) {
          // if start and end point are on the same x the distance is the difference in X.
          var result;
          var slope;
          var intercept;
          if (p1.pos == p2.pos) {
            result = Math.abs(p.pos - p1.pos);
          } else {
            slope = (p2.depth - p1.depth) / (p2.pos - p1.pos);
            intercept = p1.depth - slope * p1.pos;
            result =
              Math.abs(slope * p.pos - p.depth + intercept) /
              Math.sqrt(Math.pow(slope, 2) + 1);
          }

          return result;
        }
      },
      {},
    ],
    9: [
      function (require, module, exports) {
        var svg = {};
        // add shapes
        svg.variant = require("./variant.js");

        module.exports = svg;
      },
      { "./variant.js": 10 },
    ],
    10: [
      function (require, module, exports) {
        var variant = function () {
          // Value transformers
          var xValue = function (d) {
              return d.x;
            },
            yValue = function (d) {
              return d.y;
            },
            wValue = function (d) {
              return d.w;
            },
            hValue = function (d) {
              return d.h;
            };

          var diagonal = d3.svg.diagonal();

          function shape(d, i) {
            diagonal
              .source(function (d) {
                return { x: hValue(d) * d.y, y: d.x + Math.abs(d.w / 2) };
              })
              .target(function (d) {
                return { x: 0, y: d.x + d.w / 2 + Math.abs(d.w / 2) };
              })
              .projection(function (d) {
                return [d.y, d.x];
              });

            var variantH = hValue(d);
            var bulbW = Math.abs((variantH * 5) / 6);
            // Create control points
            var c1 = (variantH * 1) / 6 + yValue(d),
              c2 = (variantH * 2) / 6 + yValue(d),
              c3 = variantH * 0.625 + yValue(d),
              c4 = variantH * 1.145 + yValue(d);

            if (wValue(d) <= Math.abs(bulbW / 2))
              return (
                "M" +
                xValue(d) +
                "," +
                yValue(d) +
                " C" +
                xValue(d) +
                "," +
                c1 +
                " " +
                parseInt(xValue(d) + wValue(d) / 2 - bulbW / 2) +
                "," +
                c2 +
                " " +
                parseInt(xValue(d) + wValue(d) / 2 - bulbW / 2) +
                "," +
                c3 +
                " C" +
                parseInt(xValue(d) + wValue(d) / 2 - bulbW / 2) +
                "," +
                c4 +
                " " +
                parseInt(xValue(d) + wValue(d) / 2 + bulbW / 2) +
                "," +
                c4 +
                " " +
                parseInt(xValue(d) + wValue(d) / 2 + bulbW / 2) +
                "," +
                c3 +
                " C" +
                parseInt(xValue(d) + wValue(d) / 2 + bulbW / 2) +
                "," +
                c2 +
                " " +
                parseInt(xValue(d) + wValue(d)) +
                "," +
                c1 +
                " " +
                parseInt(xValue(d) + wValue(d)) +
                "," +
                yValue(d)
              );
            else
              return (
                diagonal(d) +
                diagonal({ x: xValue(d), y: yValue(d), w: -wValue(d) })
              );
          }

          /*
           * Specifies the value function *x*, which returns an integer for each datum
           * The value function is passed two arguments: the current datum and the current index.
           */
          shape.xValue = function (_) {
            if (!arguments.length) return xValue;
            xValue = _;
            return shape;
          };

          /*
           * Specifies the value function *y*, which returns an integer for each datum
           * The value function is passed two arguments: the current datum and the current index.
           */
          shape.yValue = function (_) {
            if (!arguments.length) return yValue;
            yValue = _;
            return shape;
          };

          /*
           * Specifies the value function *width*, which returns an integer for each datum
           * The value function is passed two arguments: the current datum and the current index.
           */
          shape.wValue = function (_) {
            if (!arguments.length) return wValue;
            wValue = _;
            return shape;
          };

          /*
           * Specifies the value function *height*, which returns an integer for each datum
           * The value function is passed two arguments: the current datum and the current index.
           */
          shape.hValue = function (_) {
            if (!arguments.length) return hValue;
            hValue = _;
            return shape;
          };

          return shape;
        };

        module.exports = variant;
      },
      {},
    ],
    11: [
      function (require, module, exports) {
        module.exports.format_unit_names = function (d) {
          if (d / 1000000 >= 1) d = d / 1000000 + "M";
          else if (d / 1000 >= 1) d = d / 1000 + "K";
          return d;
        };

        module.exports.format_percent = function (d, precision_places) {
          var precision_places = precision_places || 1;

          var corrector = 1;
          for (var i = 0; i < precision_places; i++) {
            corrector *= 10;
          }

          var percent = parseInt(d * (corrector * 100)) / corrector;

          return percent;
        };

        module.exports.getUID = function (separator) {
          var delim = separator || "-";

          function S4() {
            return (((1 + Math.random()) * 0x10000) | 0)
              .toString(16)
              .substring(1);
          }

          return (
            S4() +
            S4() +
            delim +
            S4() +
            delim +
            S4() +
            delim +
            S4() +
            delim +
            S4() +
            S4() +
            S4()
          );
        };

        module.exports.value_accessor = function (value, d, i) {
          return typeof value === "function" ? value(d, i) : value;
        };

        module.exports.tooltipHelper = function (
          selection,
          tooltipElem,
          titleAccessor,
        ) {
          var utils = require("./utils.js");
          selection
            .on("mouseover", function (d, i) {
              utils.showTooltip(tooltipElem, titleAccessor, d);
            })
            .on("mouseout", function (d) {
              utils.hideTooltip(tooltipElem);
            });
        };

        module.exports.showTooltip = function (tooltipElem, titleAccessor, d) {
          var utils = require("./utils.js");
          var tooltipStr = utils.value_accessor(titleAccessor, d); // handle both function and constant string
          var opacity = tooltipStr ? 0.9 : 0; // don't show if tooltipStr is null
          var elemHeight = tooltipElem.node().getBoundingClientRect().height;
          tooltipElem.transition().duration(200).style("opacity", opacity);
          tooltipElem
            .html(tooltipStr)
            .style("left", d3.event.clientX + 8 + "px")
            .style("text-align", "left")
            .style("top", d3.event.clientY - elemHeight - 8 + "px");
        };

        module.exports.endAll = function (transition, callback) {
          var n;

          if (transition.empty()) {
            callback();
          } else {
            n = transition.size();
            transition.each("end", function () {
              n--;
              if (n === 0) {
                callback();
              }
            });
          }
        };

        // Takes svg and looks for matching styles and explicity defines them
        // in a <styles> tag inside the svg elem.
        module.exports.addStylesToSvg = function (svg) {
          var used = "";
          var sheets = document.styleSheets;
          for (var i = 0; i < sheets.length; i++) {
            var rules = sheets[i].cssRules;
            if (rules == null) continue;
            for (var j = 0; j < rules.length; j++) {
              var rule = rules[j];
              if (typeof rule.style != "undefined") {
                var elems = svg.querySelectorAll(rule.selectorText);
                if (elems.length > 0) {
                  used +=
                    rule.selectorText + " { " + rule.style.cssText + " }\n";
                }
              }
            }
          }

          var s = document.createElement("style");
          s.setAttribute("type", "text/css");
          // s.innerHTML = "<![CDATA[\n" + used + "\n]]>";
          s.innerHTML = used;

          var defs = document.createElement("defs");
          defs.appendChild(s);
          svg.insertBefore(defs, svg.firstChild);
        };

        module.exports.hideTooltip = function (tooltipElem) {
          tooltipElem.transition().duration(500).style("opacity", 0);
        };

        // Copies a variable number of methods from source to target.
        module.exports.rebind = function (target, source) {
          var i = 1,
            n = arguments.length,
            method;
          while (++i < n)
            target[(method = arguments[i])] = iobio_rebind(
              target,
              source,
              source[method],
            );
          return target;
        };

        // Method is assumed to be a standard D3 getter-setter:
        // If passed with no arguments, gets the value.
        // If passed with arguments, sets the value and returns the target.
        function iobio_rebind(target, source, method) {
          return function () {
            var value = method.apply(source, arguments);
            return value === source ? target : value;
          };
        }
      },
      { "./utils.js": 11 },
    ],
    12: [
      function (require, module, exports) {
        var alignment = function () {
          // Import base chart
          var base = require("./base.js")(),
            utils = require("../utils.js"),
            extend = require("extend");

          // Value transformers
          var directionValue = null;

          // Defaults
          var elemHeight = 4,
            orientation = "down",
            events = [],
            tooltip;

          // Default Options
          var defaults = {};

          function chart(selection, opts) {
            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            // Call base chart
            base.call(this, selection, options);

            // Grab base functions for easy access
            var x = base.x(),
              y = base.y(),
              id = base.id();
            (xValue = base.xValue()),
              (yValue = base.yValue()),
              (wValue = base.wValue()),
              (yAxis = base.yAxis()),
              (color = base.color()),
              (transitionDuration = base.transitionDuration());

            // Change orientation of pileup
            if (orientation == "down") {
              // swap y scale min and max
              y.range([y.range()[1], y.range()[0]]);
              // update y axis
              if (yAxis)
                selection
                  .select(".iobio-y.iobio-axis")
                  .transition()
                  .duration(0)
                  .call(yAxis);
            }

            // Draw

            var g = selection
              .select("g.iobio-container")
              .classed("iobio-alignment", true); // grab container to draw into (created by base chart)
            var aln = g.selectAll(".alignment").data(selection.datum());

            // Enter
            aln
              .enter()
              .append("g")
              .attr("id", function (d) {
                return id(d);
              })
              .attr("class", "alignment")
              .attr("transform", function (d, i) {
                var translate =
                  "translate(" +
                  parseInt(x(xValue(d, i) + wValue(d, i) / 2)) +
                  "," +
                  parseInt(y(yValue(d, i)) - elemHeight / 2) +
                  ")";
                if (directionValue && directionValue(d, i) == "reverse")
                  return translate + " rotate(180)";
                else return translate;
              })
              .style("fill", color)
              .append("polygon")
              .attr("points", function (d) {
                // var rW = x(xValue(d)+wValue(d)) - x(xValue(d));
                var rH = elemHeight;
                // var arrW = Math.min(5, rW);

                if (directionValue)
                  // draw arrow
                  return (
                    "-0.1," +
                    -rH / 2 +
                    " 0," +
                    -rH / 2 +
                    " 0.1,0" +
                    " 0," +
                    rH / 2 +
                    " -0.1," +
                    rH / 2
                  );
                // draw rectangle
                else
                  return (
                    "-0.1," +
                    -rH / 2 +
                    " 0," +
                    -rH / 2 +
                    " 0," +
                    rH / 2 +
                    " -0.1," +
                    rH / 2
                  );
              });

            aln.exit();

            aln
              .transition()
              .duration(transitionDuration)
              .attr("transform", function (d, i) {
                var translate =
                  "translate(" +
                  parseInt(x(xValue(d, i) + wValue(d, i) / 2)) +
                  "," +
                  parseInt(y(yValue(d, i)) - elemHeight / 2) +
                  ")";
                if (directionValue && directionValue(d, i) == "reverse")
                  return translate + " rotate(180)";
                else return translate;
              })
              .style("fill", color);

            aln
              .select("polygon")
              .transition()
              .duration(transitionDuration)
              .attr("points", function (d, i) {
                var rW = x(xValue(d, i) + wValue(d, i)) - x(xValue(d, i));
                var rH = elemHeight;
                var arrW = Math.min(5, rW);

                if (directionValue)
                  return (
                    -rW / 2 +
                    "," +
                    -rH / 2 +
                    " " +
                    (rW / 2 - arrW) +
                    "," +
                    -rH / 2 +
                    " " +
                    rW / 2 +
                    ",0 " +
                    (rW / 2 - arrW) +
                    "," +
                    rH / 2 +
                    " " +
                    -rW / 2 +
                    "," +
                    rH / 2
                  );
                else
                  return (
                    -rW / 2 +
                    "," +
                    -rH / 2 +
                    " " +
                    rW / 2 +
                    "," +
                    -rH / 2 +
                    " " +
                    rW / 2 +
                    "," +
                    rH / 2 +
                    " " +
                    -rW / 2 +
                    "," +
                    rH / 2
                  );
              });

            // Add title on hover
            if (tooltip) {
              var tt = d3.select(".iobio-tooltip");
              utils.tooltipHelper(g.selectAll(".alignment"), tt, tooltip);
            }

            // Attach events
            events.forEach(function (ev) {
              g.selectAll(".alignment").on(ev.event, ev.listener);
            });
          }
          // Rebind methods in 2d.js to this chart
          base.rebind(chart);

          /*
           * Value accessor for getting the direction of the alignment
           */
          chart.directionValue = function (_) {
            if (!arguments.length) return directionValue;
            directionValue = _;
            return chart;
          };

          /*
           * Specifies the orientation of the alignment. Can be 'up' or 'down'
           */
          chart.orientation = function (_) {
            if (!arguments.length) return orientation;
            orientation = _;
            return chart;
          };

          /*
           * Set events on rects
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover rects
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          return chart;
        };

        // Export alignment
        module.exports = alignment;
      },
      { "../utils.js": 11, "./base.js": 15, extend: 2 },
    ],
    13: [
      function (require, module, exports) {
        var bar = function () {
          // Import base chart
          var base = require("./base.js")(),
            utils = require("../utils.js"),
            extend = require("extend");

          // Defaults
          var events = [],
            tooltip,
            keyValue;

          // Default Options
          var defaults = { yMin: 0 };

          function chart(selection, opts) {
            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            // Call base chart
            base.call(this, selection, options);

            // Grab base functions for easy access
            var x = base.x(),
              y = base.y(),
              id = base.id(),
              xValue = base.xValue(),
              yValue = base.yValue(),
              wValue = base.wValue(),
              keyValue = base.keyValue(),
              color = base.color(),
              transitionDuration = base.transitionDuration(),
              innerHeight =
                base.height() - base.margin().top - base.margin().bottom;

            if (innerHeight < 0) {
              console.log(
                "Negative inner height " +
                  innerHeight +
                  " calculated for bar chart. Change height or margins.",
              );
              console.trace();
              return;
            }

            // Draw
            // enter
            var g = selection
              .select("g.iobio-container")
              .classed("iobio-bar", true); // grab container to draw into (created by base chart)
            var rect = g.selectAll(".rect").data(selection.datum(), keyValue);
            // exit
            rect.exit().remove();

            // enter
            rect
              .enter()
              .append("g")
              .attr("id", id)
              .attr("class", "rect")
              .style("fill", color)
              .append("rect")
              .attr("y", function (d) {
                return innerHeight;
              })
              .attr("x", function (d, i) {
                return x(xValue(d, i));
              })
              .attr("width", function (d, i) {
                return x(xValue(d, i) + wValue(d, i)) - x(xValue(d, i));
              })
              .attr("height", function (d) {
                return 0;
              });

            // update
            rect
              .style("fill", color)
              .select("rect")
              .transition()
              .duration(transitionDuration)
              .attr("x", function (d, i) {
                return x(xValue(d, i));
              })
              .attr("y", function (d, i) {
                return y(yValue(d, i));
              })
              .attr("width", function (d, i) {
                return x(xValue(d, i) + wValue(d, i)) - x(xValue(d, i));
              })
              .attr("height", function (d, i) {
                return innerHeight - y(yValue(d, i));
              });

            // Add title on hover
            if (tooltip) {
              var tt = d3.select(".iobio-tooltip");
              utils.tooltipHelper(g.selectAll(".rect"), tt, tooltip);
            }

            // Attach events
            events.forEach(function (ev) {
              rect.on(ev.event, ev.listener);
            });
          }
          // Rebind methods in base.js to this chart
          base.rebind(chart);

          /*
           * Set events on rects
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover rects
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          /*
           * Easy method to rebind bar chart functions to the argument chart
           */
          chart.rebind = function (object) {
            base.rebind(object);
            utils.rebind(object, this, "rebind");
          };

          return chart;
        };

        // Export alignment
        module.exports = bar;
      },
      { "../utils.js": 11, "./base.js": 15, extend: 2 },
    ],
    14: [
      function (require, module, exports) {
        var barViewer = function () {
          // Import base chart
          var bar = require("./bar.js"),
            utils = require("../utils.js"),
            extend = require("extend");

          // Defaults
          var events = [],
            tooltip,
            sizeRatio = 0.8,
            origHeight;

          // Default Options
          var defaults = {};

          // Base Chart
          var baseBar = bar();

          function chart(selection, opts) {
            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            origHeight = chart.height();

            // Setup both chart divs
            selection
              .selectAll("div")
              .data([0, 0, 0])
              .enter()
              .append("div")
              .attr("class", function (d, i) {
                return "iobio-bar-" + i + " iobio-barViewer";
              });

            // Call big bar chart
            var focalBar = bar()
              .height(origHeight * sizeRatio)
              .xValue(chart.xValue())
              .yValue(chart.yValue())
              .wValue(chart.wValue())
              .xAxis(chart.xAxis())
              .yAxis(chart.yAxis())
              .margin(chart.margin())
              .width(chart.width())
              .y(chart.y())
              .x(chart.x())
              .id(chart.id())
              .color(chart.color())
              .tooltip(chart.tooltip())
              .transitionDuration(chart.transitionDuration());

            var focalSelection = selection
              .select(".iobio-bar-0")
              .datum(selection.datum());
            focalBar(focalSelection, options);

            // Call little bar chart
            var globalBar = bar()
              .xValue(chart.xValue())
              .yValue(chart.yValue())
              .wValue(chart.wValue())
              .xAxis(chart.globalXAxis())
              .yAxis(null)
              .margin(chart.margin())
              .width(chart.width())
              .transitionDuration(chart.transitionDuration())
              .id(chart.id())
              .color(chart.color())
              .tooltip("drag to zoom")
              .height(origHeight * (1 - sizeRatio))
              .brush("brush", function () {
                var x2 = globalBar.x(),
                  brush = globalBar.brush();
                var x = brush.empty() ? x2.domain() : brush.extent();
                var datum = globalSelection.datum().filter(function (d, i) {
                  return (
                    globalBar.xValue()(d, i) >= x[0] &&
                    globalBar.xValue()(d, i) <= x[1]
                  );
                });
                options.xMin = x[0];
                options.xMax = x[1];
                options.globalBar = globalBar;
                focalBar(focalSelection.datum(datum), options);
              });

            var globalSelection = selection
              .select(".iobio-bar-2")
              .datum(selection.datum());
            globalBar(globalSelection, options);

            // // Add title on hover
            //    if (tooltip) {
            //    	var tt = d3.select('.iobio-tooltip')
            //    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
            //    }

            //    // Attach events
            // events.forEach(function(ev) {
            // 	var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
            // 	g.selectAll('.rect').on(ev.event, cb);
            // })
            // focalBar.rebind(this);
          }

          // Rebind methods in bar chart to this chart
          baseBar.rebind(chart);

          /*
           * Set events on rects
           */
          chart.sizeRatio = function (_) {
            if (!arguments.length) return sizeRatio;
            sizeRatio = _;
            return chart;
          };

          /*
           * Set events on rects
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover rects
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          return chart;
        };

        // Export alignment
        module.exports = barViewer;
      },
      { "../utils.js": 11, "./bar.js": 13, extend: 2 },
    ],
    15: [
      function (require, module, exports) {
        var utils = require("../utils.js"),
          extend = require("extend");

        var base = function () {
          // Initialize

          // Dimensions
          var margin = { top: 0, right: 0, bottom: 0, left: 0 },
            width = "100%",
            height = "100%";

          // Scales
          var x = d3.scale.linear().nice(),
            y = d3.scale.linear().nice();

          // Axes
          var xAxis = d3.svg
              .axis()
              .scale(x)
              .orient("bottom")
              .tickFormat(utils.format_unit_names)
              .ticks(5),
            yAxis = d3.svg
              .axis()
              .scale(y)
              .orient("left")
              .tickFormat(function (d) {
                return d;
              })
              .ticks(5)
              .outerTickSize(0),
            globalXAxis = d3.svg
              .axis()
              .scale(x)
              .orient("bottom")
              .tickFormat(function (d) {
                return "";
              })
              .ticks(5);

          // Value transformers
          var xValue = function (d) {
              return d[0];
            },
            yValue = function (d) {
              return d[1];
            },
            wValue = function (d) {
              return d[2] || 1;
            },
            id = function (d) {
              return null;
            },
            keyValue;

          // Color
          var colorScale = d3.scale.category10(),
            color = function (d, i) {
              return colorScale(i);
            };

          // Defaults
          var events = [],
            tooltip,
            brush = d3.svg.brush(),
            preserveAspectRatio,
            transitionDuration = 400;

          // Default options
          var defaults = {};

          function chart(selection, opts) {
            var options = {};
            extend(options, defaults, opts);

            // Get container
            var container = d3.select(selection.node());
            var data = selection.datum();

            // Select the svg element, if it exists.
            var svg = container.selectAll("svg").data([0]);
            chart.svg = svg;

            // Otherwise, create svg.
            var gEnter = svg
              .enter()
              .append("svg")
              .append("g")
              .attr("class", "iobio-container");
            var g = svg.select("g");

            // Update the outer dimensions.
            svg.attr("width", width).attr("height", height);

            // Update the inner dimensions.
            g.attr(
              "transform",
              "translate(" + margin.left + "," + margin.top + ")",
            );

            // Get width, height in pixels (necessary to allow percentages to work)
            var bcr = svg.node().getBoundingClientRect();
            var widthPx = bcr.width != 0 ? bcr.width : width; // in case boundingClient doesn't work just use width
            var heightPx = bcr.height != 0 ? bcr.height : height;
            var innerHeight = heightPx - margin.top - margin.bottom;

            // Make svg resize when window resizes
            svg.attr("viewBox", "0 0 " + widthPx + " " + heightPx);
            if (preserveAspectRatio)
              svg.attr("preserveAspectRatio", preserveAspectRatio);
            container.style("-webkit-flex", "1 1 auto");
            container.style("flex", "1 1 auto");
            container.style("-webkit-order", "1");
            container.style("order", "1");

            // Convert data to standard representation greedily;
            // this is needed for nondeterministic accessors.
            data = data.map(function (d, i) {
              return [
                xValue.call(data, d, i),
                yValue.call(data, d, i),
                wValue.call(data, d, i),
              ];
            });

            var xMin =
              options.xMin === undefined || options.xMin === null
                ? d3.min(data, function (d) {
                    return d[0];
                  })
                : options.xMin;
            var xMax =
              options.xMax === undefined || options.xMax === null
                ? d3.max(data, function (d) {
                    return d[0] + d[2];
                  })
                : options.xMax;

            // Update x scale
            x.domain([xMin, xMax]);
            x.range([0, widthPx - margin.left - margin.right]);

            var yMin =
              options.yMin === undefined || options.yMin === null
                ? d3.min(data, function (d) {
                    if (d[1] && d[1].constructor === Array) return d3.min(d[1]);
                    else return d[1];
                  })
                : options.yMin;
            var yMax =
              options.yMax === undefined || options.yMax === null
                ? d3.max(data, function (d) {
                    if (d[1] && d[1].constructor === Array) return d3.max(d[1]);
                    else return d[1];
                  })
                : options.yMax;

            // This ensures number values for y when the data is an empty array
            yMin = yMin || 0;
            yMax = yMax || 0;

            // Update y scale
            y.domain([yMin, yMax]).range([innerHeight, 0]);

            // Flesh out skeletal chart
            gEnter.append("g").attr("class", "iobio-glyphs");
            gEnter
              .append("g")
              .attr("class", "iobio-x iobio-axis")
              .attr("transform", "translate(0," + y.range()[0] + ")");
            gEnter.append("g").attr("class", "iobio-y iobio-axis");
            gEnter.append("g").attr("class", "iobio-x iobio-brush");
            d3.select("body")
              .append("div")
              .attr("class", "iobio-tooltip")
              .style("opacity", 0);

            // Update the x-axis.
            if (xAxis)
              g.select(".iobio-x.iobio-axis")
                .transition()
                .duration(transitionDuration)
                .call(xAxis);

            // Update the y-axis.
            if (yAxis)
              g.select(".iobio-y.iobio-axis")
                .transition()
                .duration(transitionDuration)
                .call(yAxis);

            // Add title on hover
            if (tooltip) {
              var tt = d3.select(".iobio-tooltip");

              svg
                .on("mouseover", function (d, i) {
                  var pos = {
                    x: parseInt(
                      x.invert(
                        d3.event.pageX -
                          svg.node().getBoundingClientRect().left -
                          margin.left,
                      ),
                    ),
                    y: parseInt(
                      y.invert(
                        d3.event.pageY -
                          svg.node().getBoundingClientRect().top -
                          margin.top,
                      ),
                    ),
                  };
                  var opacity = tooltip.call(chart, svg, pos) ? 0.9 : 0; // don't show if tooltipStr is null
                  tt.transition()
                    .duration(transitionDuration)
                    .style("opacity", opacity);
                  tt.html(tooltip.call(chart, svg, pos))
                    .style("left", d3.event.pageX + "px")
                    .style("text-align", "left")
                    .style("top", d3.event.pageY - 24 + "px");
                })
                .on("mouseout", function (d) {
                  tt.transition().duration(500).style("opacity", 0);
                })
                .on("mousemove", function () {
                  var pos = {
                    x: parseInt(
                      x.invert(
                        d3.event.pageX -
                          svg.node().getBoundingClientRect().left -
                          margin.left,
                      ),
                    ),
                    y: parseInt(
                      y.invert(
                        d3.event.pageY -
                          svg.node().getBoundingClientRect().top -
                          margin.top,
                      ),
                    ),
                  };
                  var opacity = tooltip.call(chart, svg, pos) ? 0.9 : 0; // don't show if tooltip is null
                  tt.style("opacity", opacity);
                  tt.html(tooltip.call(chart, svg, pos))
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY - 24 + "px");
                });
            }

            // Add brush
            if (
              brush.on("brushend") ||
              brush.on("brushstart") ||
              brush.on("brush")
            ) {
              brush.x(x);
              svg
                .select(".iobio-brush")
                .call(brush)
                .selectAll("rect")
                .attr("y", -6)
                .attr("height", innerHeight + 6);
            }

            // Attach events
            events.forEach(function (ev) {
              var cb = ev.listener
                ? function () {
                    ev.listener.call(chart, svg);
                  }
                : null;
              svg.on(ev.event, cb);
            });

            return data;
          }

          // Member functions
          chart.margin = function (_) {
            if (!arguments.length) return margin;
            margin = _;
            return chart;
          };

          chart.width = function (_) {
            if (!arguments.length) return width;
            width = _;
            return chart;
          };

          chart.height = function (_) {
            if (!arguments.length) return height;
            height = _;
            return chart;
          };

          chart.x = function (_) {
            if (!arguments.length) return x;
            x = _;
            return chart;
          };

          chart.y = function (_) {
            if (!arguments.length) return y;
            y = _;
            return chart;
          };

          chart.xValue = function (_) {
            if (!arguments.length) return xValue;
            xValue = _;
            return chart;
          };

          chart.yValue = function (_) {
            if (!arguments.length) return yValue;
            yValue = _;
            return chart;
          };

          chart.wValue = function (_) {
            if (!arguments.length) return wValue;
            wValue = _;
            return chart;
          };

          chart.keyValue = function (_) {
            if (!arguments.length) return keyValue;
            keyValue = _;
            return chart;
          };

          chart.id = function (_) {
            if (!arguments.length) return id;
            id = _;
            return chart;
          };

          chart.xAxis = function (_) {
            if (!arguments.length) return xAxis;
            xAxis = _;
            return chart;
          };

          chart.globalXAxis = function (_) {
            if (!arguments.length) return globalXAxis;
            globalXAxis = _;
            return chart;
          };

          chart.yAxis = function (_) {
            if (!arguments.length) return yAxis;
            yAxis = _;
            return chart;
          };

          chart.preserveAspectRatio = function (_) {
            if (!arguments.length) return preserveAspectRatio;
            preserveAspectRatio = _;
            return chart;
          };

          chart.getBoundingClientRect = function (_) {
            return this.svg.node().getBoundingClientRect();
          };

          chart.transitionDuration = function (_) {
            if (!arguments.length) return transitionDuration;
            transitionDuration = _;
            return chart;
          };

          chart.color = function (_) {
            if (!arguments.length) return color;
            color = _;
            return chart;
          };

          /*
           * Add brush to chart
           */
          chart.brush = function (event, listener) {
            if (!arguments.length) return brush;
            brush.on(event, function () {
              listener.call(this, brush);
            });
            return chart;
          };

          /*
           * Add events to chart
           */
          chart.onChart = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover chart
           */
          chart.tooltipChart = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          // utility functions

          /*
           * Easy method to rebind base chart functions to the argument chart
           */
          chart.rebind = function (object) {
            utils.rebind(
              object,
              this,
              "rebind",
              "margin",
              "width",
              "height",
              "x",
              "y",
              "id",
              "xValue",
              "yValue",
              "wValue",
              "keyValue",
              "xAxis",
              "globalXAxis",
              "yAxis",
              "brush",
              "onChart",
              "tooltipChart",
              "preserveAspectRatio",
              "getBoundingClientRect",
              "transitionDuration",
              "color",
            );
          };

          return chart;
        };

        module.exports = base;
      },
      { "../utils.js": 11, extend: 2 },
    ],
    16: [
      function (require, module, exports) {
        var box = function () {
          // Import base chart
          var base = require("./base.js")(),
            utils = require("../utils.js"),
            extend = require("extend");

          // Defaults
          var events = [],
            tooltip,
            padding = 0.1,
            outerPadding = 0,
            showLabels = false,
            labels = ["q3", "median", "q1", "whisker", "whisker"],
            whiskersValue = function (d, i) {
              return d.whiskers;
            },
            quartilesValue = function (d, i) {
              return d.quartiles;
            },
            boxWidthRatio = function (d, i) {
              return 1;
            },
            whiskerType = "line",
            exitTransitionDuration = 0,
            klass = "",
            compress = false,
            compression = 0.2,
            compressionNumberLabel = function (d, i, boxWidth) {
              if (d.totalBoxes) {
                var textWidth = boxWidth * boxWidthRatio(d, i);
                var numDigits = d.totalBoxes.toString().length;
                if (textWidth / numDigits > 3) return d.totalBoxes;
                else return null;
              } else return null;
            };
          x = d3.scale.ordinal();

          // Sort Default
          var sort = function (data, compression) {
            return data.sort(function (i, j) {
              var diffM =
                (quartilesValue(i)[1] - quartilesValue(j)[1]) /
                ((quartilesValue(i)[1] + quartilesValue(j)[1]) / 2);
              var diffQ1 =
                (quartilesValue(i)[0] - quartilesValue(j)[0]) /
                ((quartilesValue(i)[0] + quartilesValue(j)[0]) / 2);
              var diffQ3 =
                (quartilesValue(i)[2] - quartilesValue(j)[2]) /
                ((quartilesValue(i)[2] + quartilesValue(j)[2]) / 2);

              // return quartilesValue(i)[1]-quartilesValue(j)[1];
              if (Math.abs(diffM) > compression) {
                return diffM;
              } else {
                return diffQ1 + diffQ3;
              }
            });
          };

          // Compress Function Default
          var compressFunc = function (data, compression) {
            var reducedData = [],
              currMedian,
              currQuartile1,
              currQuartile2,
              currBox;

            data.forEach(function (d) {
              if (!currBox) {
                currBox = {};
                extend(true, currBox, d);
                return;
              }

              var medianClose =
                Math.abs(
                  1 - quartilesValue(currBox)[1] / quartilesValue(d)[1],
                ) < compression;
              var quartile1Close =
                Math.abs(
                  1 - quartilesValue(currBox)[0] / quartilesValue(d)[0],
                ) < compression;
              var quartile3Close =
                Math.abs(
                  1 - quartilesValue(currBox)[2] / quartilesValue(d)[2],
                ) < compression;

              if (
                medianClose &&
                quartile1Close &&
                quartile3Close &&
                !d.uncompressable
              ) {
                currBox.totalBoxes = currBox.totalBoxes || 1;
                currBox.compressedBoxes = currBox.compressedBoxes || [];
                quartilesValue(currBox)[1] =
                  (quartilesValue(currBox)[1] * currBox.totalBoxes +
                    quartilesValue(d)[1]) /
                  (currBox.totalBoxes + 1);
                quartilesValue(currBox)[0] =
                  (quartilesValue(currBox)[0] * currBox.totalBoxes +
                    quartilesValue(d)[0]) /
                  (currBox.totalBoxes + 1);
                quartilesValue(currBox)[2] =
                  (quartilesValue(currBox)[2] * currBox.totalBoxes +
                    quartilesValue(d)[2]) /
                  (currBox.totalBoxes + 1);
                currBox.totalBoxes += 1;
                currBox.compressedBoxes.push(d);
              } else {
                reducedData.push(currBox);
                currBox = {};
                extend(true, currBox, d);
              }
            });
            return reducedData;
          };

          // Base chart changes
          base.xValue(function (d, i) {
            return i;
          });

          // Default Options
          var defaults = { sort: true };

          function chart(selection, opts) {
            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            // Sort Data
            var data =
              sort && options.sort
                ? sort(selection.datum(), compression)
                : selection.datum();

            // Compress Data
            data = compress ? compressFunc(data, compression) : data;

            options.yMin =
              options.yMin == undefined
                ? d3.min(data, function (d) {
                    return +whiskersValue(d)[1];
                  })
                : options.yMin;
            options.yMax =
              options.yMax == undefined
                ? d3.max(data, function (d) {
                    return +whiskersValue(d)[0];
                  })
                : options.yMax;

            // Call base chart
            base
              .wValue(function () {
                return 1;
              })
              .call(this, selection, options);

            // Grab base functions for easy access
            var y = base.y(),
              id = base.id(),
              xValue = base.xValue(),
              yValue = base.yValue(),
              wValue = base.wValue(),
              keyValue = base.keyValue(),
              tt = d3.select(".iobio-tooltip"),
              color = base.color(),
              transitionDuration = base.transitionDuration(),
              innerWidth =
                base.getBoundingClientRect().width -
                base.margin().left -
                base.margin().right;

            // Alter scales to work for boxplots

            // Setup X scale
            x.domain(
              data.map(function (d, i) {
                return i;
              }),
            );

            var totalElemUnits = 0;
            data.forEach(function (d, i) {
              totalElemUnits += boxWidthRatio(d, i);
            });
            var totalElems = data.length;
            var step =
              innerWidth /
              (outerPadding * 2 +
                padding * (totalElems - 1) +
                (1 - padding) * totalElemUnits);
            var boxWidth = step - step * padding;

            var currX = 0;
            var range = [];
            data.forEach(function (d, i) {
              range.push(currX);
              currX += boxWidth * boxWidthRatio(d, i) + step * padding;
            });
            x.range(range);

            // Draw
            var g = selection
              .select("g.iobio-container")
              .classed("iobio-box", true)
              .select("g.iobio-glyphs")
              .classed("iobio-box", true); // grab container to draw into (created by base chart)

            // g box container
            var box = g.selectAll(".box").data(data, keyValue);

            // enter
            box
              .enter()
              .append("g")
              .attr("id", id)
              .style("fill", color)
              .attr("transform", function (d, i) {
                return "translate(" + x(xValue(d, i)) + ", 0)";
              });
            // exit
            box.exit().transition().duration(exitTransitionDuration).remove();
            // update
            box.attr("class", function (d, i) {
              return "box " + utils.value_accessor(klass, d, i);
            });
            box
              .transition()
              .duration(transitionDuration)
              .attr("transform", function (d, i) {
                return "translate(" + x(xValue(d, i)) + ", 0)";
              })
              .attr("data-median", function (d) {
                return quartilesValue(d)[1];
              });

            // center line
            var center = box.selectAll(".center").data(function (d, i) {
              return [d];
            });
            // enter
            center
              .enter()
              .insert("line", "rect")
              .attr("class", "center")
              .attr("x1", function (d, i, j) {
                return (boxWidth * boxWidthRatio(d, j)) / 2;
              })
              .attr("y1", function (d) {
                return y(whiskersValue(d)[0]);
              })
              .attr("x2", function (d, i, j) {
                return (boxWidth * boxWidthRatio(d, j)) / 2;
              })
              .attr("y2", function (d) {
                return y(whiskersValue(d)[1]);
              })
              .style("opacity", 0);
            //exit
            center.exit().remove();
            // update
            center
              .transition()
              .duration(transitionDuration)
              .attr("y1", function (d) {
                return y(whiskersValue(d)[0]);
              })
              .attr("y2", function (d) {
                return y(whiskersValue(d)[1]);
              })
              .style("opacity", 1);

            // compression Number
            // var fd = data.filter(function(d,i) {
            //  			returncompressionNumberLabel(d,i,boxWidth) !== null
            //  		})
            var compressionNumber = box
              .selectAll(".compressionNumber")
              .data(function (d) {
                return [d];
              });

            // enter
            compressionNumber
              .enter()
              .append("text")
              .attr("class", "compressionNumber")
              .attr("x", function (d, i, j) {
                return (boxWidth * boxWidthRatio(d, j)) / 2;
              })
              .attr("y", function (d) {
                return y(whiskersValue(d)[0]) - 10;
              })
              .text(function (d, i, j) {
                return compressionNumberLabel(d, j, boxWidth);
              })
              .style("text-anchor", "middle")
              .style("opacity", 0)
              .style("fill", "rgb(200,200,200")
              .on("click", function (d) {
                d.compressedBoxes.forEach(function (box) {
                  box.uncompressable = true;
                });
                chart(selection, { sort: false });
              });
            //exit
            compressionNumber
              .filter(function (d, i, j) {
                return compressionNumberLabel(d, i, boxWidth) == null;
              })
              .remove();
            // update
            compressionNumber
              .transition()
              .duration(transitionDuration)
              .attr("x", function (d, i, j) {
                return (boxWidth * boxWidthRatio(d, j)) / 2;
              })
              .attr("y", function (d) {
                return y(whiskersValue(d)[0]) - 7;
              })
              .style("opacity", 1)
              .text(function (d, i, j) {
                return compressionNumberLabel(d, j, boxWidth);
              });

            // rect
            var rect = box.selectAll(".rect").data(function (d) {
              return [d];
            });
            // enter
            rect
              .enter()
              .append("rect")
              .attr("class", "rect")
              .attr("y", function (d) {
                return y(quartilesValue(d)[0]);
              })
              .attr("x", function (d, i, j) {
                return (boxWidth * boxWidthRatio(d, j)) / 2;
              })
              .attr("width", function (d, i) {
                return 0;
              })
              .attr("height", function (d) {
                return y(quartilesValue(d)[2]) - y(quartilesValue(d)[0]);
              });
            // exit
            rect.exit().remove();
            // update - use selection.selectAll instead of rect b\c rect doesn't supply the i elem for some reason
            rect
              .transition()
              .duration(transitionDuration)
              .attr("y", function (d, i) {
                return y(quartilesValue(d)[0]);
              })
              .attr("x", function (d, i) {
                return 0;
              })
              .attr("width", function (d, i, j) {
                return boxWidth * boxWidthRatio(d, j);
              })
              .attr("height", function (d) {
                return y(quartilesValue(d)[2]) - y(quartilesValue(d)[0]);
              });

            // tooltip
            utils.tooltipHelper(box, tt, tooltip);

            // median line
            // var median = box.selectAll('.median').data(function(d) {return [quartilesValue(d)[1]];});
            var median = box.selectAll(".median").data(function (d) {
              return [d];
            });
            // enter
            median
              .enter()
              .append("line")
              .attr("class", "median")
              .attr("x1", function (d, i, j) {
                return (boxWidth * boxWidthRatio(d, j)) / 2;
              })
              .attr("y1", function (d) {
                return y(quartilesValue(d)[1]);
              })
              .attr("x2", function (d, i, j) {
                return (boxWidth * boxWidthRatio(d, j)) / 2;
              })
              .attr("y2", function (d) {
                return y(quartilesValue(d)[1]);
              });

            // exit
            median.exit().remove();
            // update
            median
              .transition()
              .duration(transitionDuration)
              .attr("x1", 0)
              .attr("y1", function (d) {
                return y(quartilesValue(d)[1]);
              })
              .attr("x2", function (d, i, j) {
                return boxWidth * boxWidthRatio(d, j);
              })
              .attr("y2", function (d) {
                return y(quartilesValue(d)[1]);
              });

            // whiskers
            var whisker = box.selectAll(".whisker").data(function (d, i) {
              var w = whiskersValue(d);
              var width = boxWidthRatio(d, i) * boxWidth;
              return [
                [w[0], width],
                [w[1], width],
              ];
            });
            if (utils.value_accessor(whiskerType, boxWidth) == "circle") {
              // enter
              whisker
                .enter()
                .append("circle")
                .attr("class", "whisker")
                .attr("cx", function (d, i) {
                  return d[1] / 2;
                })
                .attr("cy", function (d, i) {
                  return y(d[0]);
                })
                .attr("r", 0);
              // exit
              whisker.exit().remove();
              // update
              selection
                .selectAll(".whisker")
                .transition()
                .duration(transitionDuration)
                .attr("cx", function (d, i) {
                  return d[1] / 2;
                })
                .attr("cy", function (d, i) {
                  return y(d[0]);
                })
                .attr("r", function (d, i) {
                  return d[1] / 2;
                });
            } else {
              // enter
              whisker
                .enter()
                .append("line")
                .attr("class", "whisker")
                .attr("x1", function (d, i) {
                  return d[1] / 2;
                })
                .attr("y1", function (d, i) {
                  return y(d[0]);
                })
                .attr("x2", function (d, i) {
                  return d[1] / 2;
                })
                .attr("y2", function (d, i) {
                  return y(d[0]);
                });
              // exit
              whisker.exit().remove();
              // update
              selection
                .selectAll(".whisker")
                .transition()
                .duration(transitionDuration)
                .attr("x1", 0)
                .attr("y1", function (d, i) {
                  return y(d[0]);
                })
                .attr("x2", function (d, i) {
                  return d[1];
                })
                .attr("y2", function (d, i) {
                  return y(d[0]);
                });
            }
            // box plot labels
            if (showLabels) {
              var label = box.selectAll(".label").data(function (d) {
                return quartilesValue(d).concat(whiskersValue(d));
              });
              // enter
              label
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", function (d, i) {
                  return boxWidth + 2;
                })
                .attr("y", y)
                .attr("alignment-baseline", "middle")
                .text(function (d, i) {
                  return labels[i];
                });
              // exit
              label.exit().remove();
              // enter
              label
                .transition()
                .duration(transitionDuration)
                .attr("x", function (d, i) {
                  return boxWidth + 2;
                })
                .attr("y", y)
                .text(function (d, i) {
                  return labels[i];
                });
            }

            // tooltip
            utils.tooltipHelper(whisker, tt, function (d) {
              return d;
            });

            // Add title on hover
            //    if (tooltip) {
            //    	var tt = d3.select('.iobio-tooltip')
            //    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
            //    }

            //    // Attach events
            // events.forEach(function(ev) {
            // 	rect.on(ev.event, ev.listener);
            // })
          }
          // Rebind methods in base.js to this chart
          base.rebind(chart);

          /* Chart Member Functions */

          /*
           * Boolean for showing the labels
           * data format = true | false
           */
          chart.showLabels = function (_) {
            if (!arguments.length) return showLabels;
            showLabels = _;
            return chart;
          };

          /*
           * Array for defining the labels
           * data format = true | false
           */
          chart.labels = function (_) {
            if (!arguments.length) return labels;
            labels = _;
            return chart;
          };

          /*
           * Value accessor for whiskers
           * data format = [max, min]
           */
          chart.whiskersValue = function (_) {
            if (!arguments.length) return whiskersValue;
            whiskersValue = _;
            return chart;
          };

          /*
           * Value accessor for quartiles
           * data format = [q3, median, q1]
           */
          chart.quartilesValue = function (_) {
            if (!arguments.length) return quartilesValue;
            quartilesValue = _;
            return chart;
          };

          /*
           * Sets the boxWidthRatio, which allows boxes to be of different widths
           * e.g. function(d,i) { if (i==2) return 3; else return 1; }) would make
           * the 3rd box 3 times as wide as all the other boxes
           * default is 1
           */
          chart.boxWidthRatio = function (_) {
            if (!arguments.length) return boxWidthRatio;
            boxWidthRatio = _;
            return chart;
          };

          /*
           * Set the sort function that determines the order of the box plots
           * Same as JS sort function
           * if set to null, then no sorting will occur
           */
          chart.sort = function (_) {
            if (!arguments.length) return sort;
            sort = _;
            return chart;
          };

          /*
           * Boolean to either compress the box plots or not
           * If true multiple similar boxPlots will try to be compressed into
           * a single box plot using the compressFunc
           */
          chart.compress = function (_) {
            if (!arguments.length) return compress;
            compress = _;
            return chart;
          };

          /*
           * The function that compress the box plot data
           * This should return an array of data
           */
          chart.compressFunc = function (_) {
            if (!arguments.length) return compressFunc;
            compressFunc = _;
            return chart;
          };

          /*
           * Takes value between '0' and '1'
           * Determines how aggressively to compress the box plot data
           */
          chart.compression = function (_) {
            if (!arguments.length) return compression;
            compression = _;
            return chart;
          };

          /*
           * Function for the text to be written on compressed boxes
           */
          chart.compressionNumberLabel = function (_) {
            if (!arguments.length) return compressionNumberLabel;
            compressionNumberLabel = _;
            return chart;
          };

          /*
           * Set outer padding according to https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands
           */
          chart.outerPadding = function (_) {
            if (!arguments.length) return outerPadding;
            outerPadding = _;
            return chart;
          };

          /*
           * Set step padding according to https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands
           */
          chart.padding = function (_) {
            if (!arguments.length) return padding;
            padding = _;
            return chart;
          };

          /*
           * Either a 'line' or a 'circle'
           */
          chart.whiskerType = function (_) {
            if (!arguments.length) return whiskerType;
            whiskerType = _;
            return chart;
          };

          /*
           * Set duration of exitTransition
           */
          chart.exitTransitionDuration = function (_) {
            if (!arguments.length) return exitTransitionDuration;
            exitTransitionDuration = _;
            return chart;
          };

          /*
           * Set class on the g element of each box plot
           */
          chart.class = function (_) {
            if (!arguments.length) return klass;
            klass = _;
            return chart;
          };

          /*
           * Set events on rects
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover rects
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          /*
           * Easy method to rebind box chart functions to the argument chart
           */
          chart.rebind = function (object) {
            base.rebind(object);
            utils.rebind(
              object,
              this,
              "rebind",
              "showLabels",
              "labels",
              "whiskersValue",
              "quartilesValue",
              "boxWidthRatio",
              "sort",
              "compress",
              "compressFunc",
              "compression",
              "compressionNumberLabel",
              "outerPadding",
              "padding",
              "whiskerType",
              "preserveAspectRatio",
              "exitTransitionDuration",
              "class",
            );
          };

          return chart;
        };

        // Export alignment
        module.exports = box;
      },
      { "../utils.js": 11, "./base.js": 15, extend: 2 },
    ],
    17: [
      function (require, module, exports) {
        var boxViewer = function () {
          // Import base chart
          var box = require("./box.js"),
            utils = require("../utils.js"),
            extend = require("extend");

          // Defaults
          var events = [],
            tooltip,
            sizeRatio = 0.8,
            origHeight,
            exitDuration = 0;

          // Default Options
          var defaults = {};

          // Base Chart
          var basebox = box();
          var focalbox, globalbox;

          function chart(selection, opts) {
            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            // Set Height
            origHeight = chart.height();

            // Setup both chart divs
            selection
              .selectAll("div")
              .data([0, 0])
              .enter()
              .append("div")
              .attr("class", function (d, i) {
                return "iobio-box-" + i + " iobio-boxViewer";
              });

            // Call big box chart
            focalbox = box()
              .height(origHeight * sizeRatio)
              .xValue(chart.xValue())
              .yValue(chart.yValue())
              .wValue(chart.wValue())
              .xAxis(chart.xAxis())
              .yAxis(chart.yAxis())
              .whiskersValue(chart.whiskersValue())
              .quartilesValue(chart.quartilesValue())
              .boxWidthRatio(chart.boxWidthRatio())
              .sort(chart.sort())
              .compress(chart.compress())
              .compressFunc(chart.compressFunc())
              .compression(chart.compression())
              .compressionNumberLabel(chart.compressionNumberLabel())
              .outerPadding(chart.outerPadding())
              .padding(chart.padding())
              .whiskerType(chart.whiskerType())
              .class(chart.class())
              .margin(chart.margin())
              .width(chart.width())
              .preserveAspectRatio(chart.preserveAspectRatio())
              .y(chart.y())
              .x(chart.x())
              .id(chart.id())
              .keyValue(chart.keyValue())
              .color(chart.color())
              .tooltip(chart.tooltip())
              .transitionDuration(chart.transitionDuration());

            var focalSelection = selection
              .select(".iobio-box-0")
              .datum(selection.datum());
            focalbox(focalSelection, options);

            // Call little box chart
            globalbox = box()
              .xValue(chart.xValue())
              .yValue(chart.yValue())
              .wValue(chart.wValue())
              .xAxis(chart.xAxis())
              .yAxis(null)
              .whiskersValue(chart.whiskersValue())
              .quartilesValue(chart.quartilesValue())
              .boxWidthRatio(chart.boxWidthRatio())
              .sort(chart.sort())
              .compress(chart.compress())
              .compressFunc(chart.compressFunc())
              .compression(chart.compression())
              .compressionNumberLabel(chart.compressionNumberLabel())
              .outerPadding(chart.outerPadding())
              .padding(chart.padding())
              .whiskerType(chart.whiskerType())
              .class(chart.class())
              .margin(chart.margin())
              .width(chart.width())
              .preserveAspectRatio(chart.preserveAspectRatio())
              .transitionDuration(chart.transitionDuration())
              .id(chart.id())
              .keyValue(chart.keyValue())
              .color(chart.color())
              .tooltip(chart.tooltip())
              .height(origHeight * (1 - sizeRatio))
              .brush("brush", function () {
                var x2 = globalbox.x(),
                  brush = globalbox.brush();
                var x = brush.empty() ? x2.domain() : brush.extent();
                var datum = globalSelection.datum().filter(function (d, i) {
                  return (
                    globalbox.xValue()(d, i) >= x[0] &&
                    globalbox.xValue()(d, i) <= x[1]
                  );
                });

                //  Delay exit when sliding brush window
                // if (brush.empty())
                // 	focalbox.exitTransitionDuration(0)
                // else
                // 	focalbox.exitTransitionDuration( focalbox.transitionDuration() )

                // Draw
                options.xMin = x[0];
                options.xMax = x[1];
                options.globalbox = globalbox;
                options.sort = false;
                focalbox(focalSelection.datum(datum), options);
              });

            var globalSelection = selection
              .select(".iobio-box-1")
              .datum(selection.datum());
            globalbox(globalSelection, options);

            // // Add title on hover
            //    if (tooltip) {
            //    	var tt = d3.select('.iobio-tooltip')
            //    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
            //    }

            //    // Attach events
            // events.forEach(function(ev) {
            // 	var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
            // 	g.selectAll('.rect').on(ev.event, cb);
            // })
            // focalbox.rebind(this);
          }

          // Rebind methods in box chart to this chart
          basebox.rebind(chart);

          /*
           * Set events on rects
           */
          chart.sizeRatio = function (_) {
            if (!arguments.length) return sizeRatio;
            sizeRatio = _;
            return chart;
          };

          /*
           * Set events on rects
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover rects
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          chart.focalbox = function (_) {
            if (!arguments.length) return focalbox;
            focalbox = _;
            return chart;
          };

          chart.globalbox = function (_) {
            if (!arguments.length) return globalbox;
            globalbox = _;
            return chart;
          };

          return chart;
        };

        // Export alignment
        module.exports = boxViewer;
      },
      { "../utils.js": 11, "./box.js": 16, extend: 2 },
    ],
    18: [
      function (require, module, exports) {
        var boxViewer2 = function () {
          // Import base chart
          var box = require("./box.js"),
            base = require("./base.js")();
          (utils = require("../utils.js")), (extend = require("extend"));

          // Defaults
          var events = [],
            tooltip,
            sizeRatio = 0.8,
            origHeight,
            exitDuration = 0;

          // Default Options
          var defaults = {};

          // Base Chart
          var basebox = box();
          var focalbox, globalbox;

          function chart(selection, opts) {
            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            // Set Height
            origHeight = chart.height();

            // Setup both chart divs
            selection
              .selectAll("div")
              .data([0, 0])
              .enter()
              .append("div")
              .attr("class", function (d, i) {
                return "iobio-box-" + i + " iobio-boxViewer";
              });

            // Call big box chart
            focalbox = box()
              .height(origHeight * sizeRatio)
              .xValue(chart.xValue())
              .yValue(chart.yValue())
              .wValue(chart.wValue())
              .xAxis(chart.xAxis())
              .yAxis(chart.yAxis())
              .whiskersValue(chart.whiskersValue())
              .quartilesValue(chart.quartilesValue())
              .boxWidthRatio(chart.boxWidthRatio())
              .sort(chart.sort())
              .compress(chart.compress())
              .compressFunc(chart.compressFunc())
              .compression(chart.compression())
              .compressionNumberLabel(chart.compressionNumberLabel())
              .outerPadding(chart.outerPadding())
              .padding(chart.padding())
              .whiskerType(chart.whiskerType())
              .class(chart.class())
              .margin(chart.margin())
              .width(chart.width())
              .preserveAspectRatio(chart.preserveAspectRatio())
              .y(chart.y())
              .x(chart.x())
              .id(chart.id())
              .keyValue(chart.keyValue())
              .color(chart.color())
              .tooltip(chart.tooltip())
              .transitionDuration(chart.transitionDuration());

            var focalSelection = selection
              .select(".iobio-box-0")
              .datum(selection.datum());
            focalbox(focalSelection, options);

            // var doctype = '<?xml version="1.0" standalone="no"?>'
            // + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

            // 		var source = (new XMLSerializer()).serializeToString(d3.select('.iobio-box-0 svg').node());
            // 		var blob = new Blob([ doctype + source], { type: 'image/svg+xml;charset=utf-8' });
            // 		var url = window.URL.createObjectURL(blob);
            // 		var img = d3.select('body').append('img')
            // 			.style('border', '1px solid red')
            // 			.attr('id', 'chase')
            // 	.attr('width', 800)
            // 	.attr('height', 400)
            // 	.node();
            // img.src = url;

            // Call little box chart
            globalbox = base
              .xValue(chart.xValue())
              .yValue(chart.yValue())
              .wValue(chart.wValue())
              .xAxis(chart.xAxis())
              .yAxis(null)
              .margin(chart.margin())
              .width(chart.width())
              .preserveAspectRatio(chart.preserveAspectRatio())
              .transitionDuration(chart.transitionDuration())
              .id(chart.id())
              .keyValue(chart.keyValue())
              .height(origHeight * (1 - sizeRatio))
              .brush("brush", function () {
                var x2 = globalbox.x(),
                  brush = globalbox.brush();
                var x = brush.empty() ? x2.domain() : brush.extent();
                var datum = globalSelection.datum().filter(function (d, i) {
                  return (
                    globalbox.xValue()(d, i) >= x[0] &&
                    globalbox.xValue()(d, i) <= x[1]
                  );
                });

                //  Delay exit when sliding brush window
                // if (brush.empty())
                // 	focalbox.exitTransitionDuration(0)
                // else
                // 	focalbox.exitTransitionDuration( focalbox.transitionDuration() )

                // Draw
                options.xMin = x[0];
                options.xMax = x[1];
                options.globalbox = globalbox;
                options.sort = false;
                focalbox(focalSelection.datum(datum), options);
              });

            var globalSelection = selection
              .select(".iobio-box-1")
              .datum(selection.datum());
            globalbox(globalSelection, options);

            setTimeout(function () {
              var doctype =
                '<?xml version="1.0" standalone="no"?>' +
                '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
              // serialize our SVG XML to a string.
              // styles(document.getElementById('testSvg'));
              var svgNode = d3.select(".iobio-box-0 svg g.iobio-glyphs").node();
              utils.addStylesToSvg(svgNode);
              var source1 = new XMLSerializer().serializeToString(svgNode);
              // var source = '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="400" viewBox="0 0 960 400">' + source1 + '</svg>';
              var source =
                '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="400">' +
                source1 +
                "</svg>";
              // var source = (new XMLSerializer()).serializeToString(svgNode);
              // create a file blob of our SVG.
              var blob = new Blob([doctype + source], {
                type: "image/svg+xml;charset=utf-8",
              });
              var url = window.URL.createObjectURL(blob);
              // Put the svg into an image tag so that the Canvas element can read it in.

              var gHeight =
                globalbox.height() -
                globalbox.margin().top -
                globalbox.margin().bottom;
              var gWidth = globalbox.width();
              var img = d3
                .select(".iobio-box-1 .iobio-glyphs")
                .append("foreignObject")
                .attr("width", gWidth)
                .attr("height", gHeight)
                .append("xhtml:img")
                .attr("width", gWidth)
                .attr("height", gHeight)
                .node();

              img.src = url;

              // var img = d3.select('.iobio-box-1 .iobio-glyphs').append('foreignObject')
              //  .attr('width', 960)
              //  .attr('height', 100)
              //  .append('xhtml:div')
              // 	 .attr('width', 960)
              // 	 .attr('height', 100)
              // 	 .style('border', '1px solid red')
              // 	 .node();
            }, chart.transitionDuration());

            // // Add title on hover
            //    if (tooltip) {
            //    	var tt = d3.select('.iobio-tooltip')
            //    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
            //    }

            //    // Attach events
            // events.forEach(function(ev) {
            // 	var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
            // 	g.selectAll('.rect').on(ev.event, cb);
            // })
            // focalbox.rebind(this);
          }

          // Rebind methods in box chart to this chart
          basebox.rebind(chart);

          /*
           * Set events on rects
           */
          chart.sizeRatio = function (_) {
            if (!arguments.length) return sizeRatio;
            sizeRatio = _;
            return chart;
          };

          /*
           * Set events on rects
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover rects
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          chart.focalbox = function (_) {
            if (!arguments.length) return focalbox;
            focalbox = _;
            return chart;
          };

          chart.globalbox = function (_) {
            if (!arguments.length) return globalbox;
            globalbox = _;
            return chart;
          };

          return chart;
        };

        // Export alignment
        module.exports = boxViewer2;
      },
      { "../utils.js": 11, "./base.js": 15, "./box.js": 16, extend: 2 },
    ],
    19: [
      function (require, module, exports) {
        //
        // consumes data in following format
        // var data = [ {name: 'somename',
        //              start: someInt,
        //              end : someInt,
        //              strand : '+',
        //              features : [{start:someInt, end:someInt, feature_type:utr, strand:'+'},
        //                          {start:someInt, end:someInt, feature_type:cds}, ...]
        //            }, ... ]
        //

        var gene = function () {
          // Import base chart
          var base = require("./base.js")(),
            utils = require("../utils.js"),
            extend = require("extend");

          // Defaults
          var events = [],
            tooltip,
            trackHeight = 20,
            borderRadius = 1,
            utrHeight = undefined,
            cdsHeight = undefined,
            arrowHeight = undefined,
            start = function (d) {
              return d.start;
            },
            end = function (d) {
              return d.end;
            },
            title = function (d) {
              return d.transcript_id;
            };

          // Default Options
          var defaults = {};

          // Modify Base Chart
          base
            .yAxis(null)
            .xValue(function (d) {
              return start(d);
            })
            .yValue(function (d, i) {
              return i;
            })
            .wValue(function (d) {
              return end(d) - start(d);
            });

          function chart(selection, opts) {
            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            // Set variables if not user set
            utrHeight = utrHeight || trackHeight / 2;
            arrowHeight = arrowHeight || trackHeight / 2;
            cdsHeight = cdsHeight || trackHeight;

            // Call base chart
            base.call(this, selection, options);

            // Grab base functions for easy access
            var x = base.x(),
              y = base.y(),
              id = base.id(),
              xValue = base.xValue(),
              yValue = base.yValue(),
              wValue = base.wValue(),
              color = base.color(),
              transitionDuration = base.transitionDuration();

            // Grab Container
            var g = selection
              .select("g.iobio-container")
              .classed("iobio-gene", true); // grab container to draw into (created by base chart)

            // Move Axis up
            g.select(".iobio-axis").attr("transform", "translate(0,-25)");

            // Draw
            // enter
            var transcript = g.selectAll(".transcript").data(selection.datum());
            // exit
            transcript.exit().remove();

            // enter
            transcript
              .enter()
              .append("g")
              .attr("class", "transcript")
              .attr("id", id)
              .attr("transform", function (d, i) {
                return "translate(0,0)";
              });

            transcript
              .selectAll(".reference")
              .data(function (d) {
                return [[start(d), end(d)]];
              })
              .enter()
              .append("line")
              .attr("class", "reference")
              .attr("x1", function (d) {
                return x(d[0]);
              })
              .attr("x2", function (d) {
                return x(d[1]);
              })
              .attr("y1", trackHeight / 2)
              .attr("y2", trackHeight / 2);

            transcript
              .selectAll(".name")
              .data(function (d) {
                return [[start(d), title(d)]];
              })
              .enter()
              .append("text")
              .attr("class", "name")
              .attr("x", function (d) {
                return x(d[0]) - 5;
              })
              .attr("y", trackHeight / 2)
              .attr("text-anchor", "end")
              .attr("alignment-baseline", "middle")
              .text(function (d) {
                return d[1];
              })
              .style("fill-opacity", 0);

            transcript
              .selectAll(".arrow")
              .data(centerSpan)
              .enter()
              .append("path")
              .attr("class", "arrow")
              .attr("d", centerArrow);

            transcript
              .selectAll(".feature")
              .data(function (d) {
                return d["features"].filter(function (d) {
                  var ft = d.feature_type.toLowerCase();
                  return ft == "utr" || ft == "cds";
                });
              })
              .enter()
              .append("g")
              .attr("class", function (d) {
                return d.feature_type.toLowerCase() + " feature";
              })
              .style("fill", color)
              .append("rect")
              .attr("rx", borderRadius)
              .attr("ry", borderRadius)
              .attr("x", function (d) {
                return x(d.start);
              })
              .attr("width", function (d) {
                return x(d.end) - x(d.start);
              })
              .attr("y", trackHeight / 2)
              .attr("height", 0);

            // update
            transcript
              .transition()
              .duration(transitionDuration)
              .attr("transform", function (d, i) {
                return "translate(0," + y(i) + ")";
              });

            transcript
              .selectAll(".reference")
              .transition()
              .duration(transitionDuration)
              .attr("x1", function (d) {
                return x(d[0]);
              })
              .attr("x2", function (d) {
                return x(d[1]);
              });

            transcript
              .selectAll(".arrow")
              .transition()
              .duration(transitionDuration)
              .attr("d", centerArrow);

            transcript
              .selectAll(".name")
              .transition()
              .duration(transitionDuration)
              .attr("x", function (d) {
                return x(d[0]) - 5;
              })
              .attr("y", trackHeight / 2)
              .text(function (d) {
                return d[1];
              })
              .style("fill-opacity", 1);

            transcript
              .selectAll(".feature")
              .style("fill", color)
              .selectAll("rect")
              .sort(function (a, b) {
                return parseInt(a.start) - parseInt(b.start);
              })
              .transition()
              .duration(transitionDuration)
              .attr("x", function (d) {
                return x(d.start);
              })
              .attr("width", function (d) {
                return x(d.end) - x(d.start);
              })
              .attr("y", function (d) {
                if (d.feature_type.toLowerCase() == "utr")
                  return (trackHeight - utrHeight) / 2;
                else return (trackHeight - cdsHeight) / 2;
              })
              .attr("height", function (d) {
                if (d.feature_type.toLowerCase() == "utr") return utrHeight;
                else return cdsHeight;
              });

            // Add tooltip on hover
            if (tooltip) {
              var tt = d3.select(".iobio-tooltip");
              utils.tooltipHelper(
                transcript.selectAll(".utr,.cds"),
                tt,
                tooltip,
              );
            }

            // Attach events
            events.forEach(function (ev) {
              g.selectAll(".transcript").on(ev.event, ev.listener);
            });
          }
          // Rebind methods in base.js to this chart
          base.rebind(chart);

          // Helper Functions

          // moves selection to front of svg
          function moveToFront(selection) {
            return selection.each(function () {
              this.parentNode.appendChild(this);
            });
          }

          // updates the hash with the center of the biggest span between features
          function centerSpan(d) {
            var span = 0;
            var center = 0;
            var sorted = d.features
              .filter(function (f) {
                var ft = f.feature_type.toLowerCase();
                return ft == "utr" || ft == "cds";
              })
              .sort(function (a, b) {
                return parseInt(a.start) - parseInt(b.start);
              });

            for (var i = 0; i < sorted.length - 1; i++) {
              var currSpan =
                parseInt(sorted[i + 1].start) - parseInt(sorted[i].end);
              if (span < currSpan) {
                span = currSpan;
                center = parseInt(sorted[i].end) + span / 2;
              }
            }
            d.center = center;
            return [d];
          }

          // generates the arrow path
          function centerArrow(d) {
            var x = chart.x();
            var arrowHead = parseInt(d.strand + "5");
            var pathStr = "M ";
            pathStr += x(d.center) + " " + (trackHeight - arrowHeight) / 2;
            pathStr +=
              " L " + parseInt(x(d.center) + arrowHead) + " " + trackHeight / 2;
            pathStr +=
              " L " +
              x(d.center) +
              " " +
              parseInt(trackHeight + arrowHeight) / 2;
            return pathStr;
          }

          chart.trackHeight = function (_) {
            if (!arguments.length) return trackHeight;
            trackHeight = _;
            return chart;
          };

          chart.utrHeight = function (_) {
            if (!arguments.length) return utrHeight;
            utrHeight = _;
            return chart;
          };

          chart.cdsHeight = function (_) {
            if (!arguments.length) return cdsHeight;
            cdsHeight = _;
            return chart;
          };

          chart.arrowHeight = function (_) {
            if (!arguments.length) return arrowHeight;
            arrowHeight = _;
            return chart;
          };

          chart.start = function (_) {
            if (!arguments.length) return start;
            start = _;
            return chart;
          };

          chart.end = function (_) {
            if (!arguments.length) return end;
            end = _;
            return chart;
          };

          chart.title = function (_) {
            if (!arguments.length) return title;
            title = _;
            return chart;
          };

          /*
           * Set events on rects
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover rects
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          return chart;
        };

        // Export alignment
        module.exports = gene;
      },
      { "../utils.js": 11, "./base.js": 15, extend: 2 },
    ],
    20: [
      function (require, module, exports) {
        var line = function (container) {
          // Import base chart
          var base = require("./base.js")(),
            utils = require("../utils.js"),
            extend = require("extend");

          // Defaults
          var numBins = 4,
            events = [],
            tooltip;

          // Default Options
          var defaults = {};

          function chart(selection, opts) {
            selection.each(function () {
              var selection = d3.select(this);

              // Merge defaults and options
              var options = {};
              extend(options, defaults, opts);

              if (options.datumTransform) {
                selection.datum(options.datumTransform(selection.datum()));
              }

              // Call base chart
              base.call(this, selection, options);

              // Grab base functions for easy access
              var x = base.x(),
                y = base.y(),
                id = base.id(),
                xValue = base.xValue(),
                yValue = base.yValue(),
                wValue = base.wValue(),
                transitionDuration = base.transitionDuration();
              color = base.color();

              // Draw
              var lineGen = d3.svg
                .line()
                .interpolate("linear")
                .x(function (d, i) {
                  return +x(xValue(d, i));
                })
                .y(function (d, i) {
                  return +y(yValue(d, i));
                });

              var g = selection
                .select("g.iobio-container")
                .classed("iobio-line", true); // grab container to draw into (created by base chart)

              // draw line
              var gEnter = g
                .selectAll(".line")
                .data([0])
                .enter()
                .append("path")
                .attr("class", "line")
                .attr("d", lineGen(selection.datum()))
                .style("stroke", color)
                .style("stroke-width", "2")
                .style("fill", "none");

              var path = g.select("path.line");
              var totalLength = path.node().getTotalLength();

              // draw line from left first time
              gEnter
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength);

              path
                .transition()
                .duration(transitionDuration)
                .attr("d", lineGen(selection.datum()))
                .ease("linear")
                .attr("stroke-dashoffset", 0);

              // Remove stroke-dasharray after done with transition
              // precaution for if path is manipulated elsewhere
              setTimeout(function () {
                path.attr("stroke-dasharray", null);
              }, transitionDuration);
            });
          }

          // Rebind methods in base.js to this chart
          base.rebind(chart);

          return chart;
        };

        // Export circle
        module.exports = line;
      },
      { "../utils.js": 11, "./base.js": 15, extend: 2 },
    ],
    21: [
      function (require, module, exports) {
        var multiLine = function () {
          // Import base chart
          var lineBase = require("./line.js")(),
            utils = require("../utils.js"),
            extend = require("extend");

          // Value transformers
          var nameValue = function (d) {
              return d[0];
            },
            dataValue = function (d) {
              return d[1];
            };

          // Axes
          var xAxis = d3.svg
            .axis()
            .orient("bottom")
            .tickFormat(utils.format_unit_names)
            .ticks(5);
          var yAxis = d3.svg
            .axis()
            .orient("left")
            .tickFormat(function (d) {
              return d;
            })
            .ticks(5)
            .outerTickSize(0);

          // Defaults
          var events = [],
            selected = "all",
            color = d3.scale.category20(),
            epsilonRate = 0.1;

          // Default Options
          var defaults = {};

          function chart(selection, opts) {
            chart.selection = selection;

            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            var data;
            // Get selected button if one
            selected = options.selected || "all";

            // Grab base line functions for easy access
            var xValue = chart.xValue(),
              yValue = chart.yValue(),
              m = chart.margin(),
              w = chart.width(),
              h = chart.height(),
              x = chart.x(),
              y = chart.y();
            transitionDuration = chart.transitionDuration();

            // Smoothing function
            var smooth = iobio.viz.layout
              .pointSmooth()
              .size((w * h) / 5)
              .pos(function (d, i) {
                return (d.globalPos || 0) + xValue(d, i);
              })
              .epsilonRate(epsilonRate);

            // Add global positions to data
            var curr = 0,
              points = [],
              selectedGlobalpos;

            selection.datum().forEach(function (d, i) {
              if (selected == "all") {
                d.globalPos = curr;
                var pointData = dataValue(d, i);
                curr += chart.xValue()(pointData[pointData.length - 1], i);
                pointData.forEach(function (p) {
                  p.globalPos = d.globalPos;
                });
                points = points.concat(pointData);
              } else {
                d.globalPos = 0;
                if (selected == nameValue(d, i)) {
                  points = dataValue(d, i);
                }
              }
            });

            var yMin =
              options.yMin === undefined || options.yMin === null
                ? d3.min(points, function (d) {
                    return yValue(d);
                  })
                : options.yMin;
            var yMax =
              options.yMax === undefined || options.yMax === null
                ? d3.max(points, function (d) {
                    return yValue(d);
                  })
                : options.yMax;

            // This ensures number values for y when the data is an empty array
            yMin = yMin || 0;
            yMax = yMax || 0;

            // Update y scale
            y.domain([yMin, yMax]).range([innerHeight, 0]);
            yAxis.scale(y);

            if (!selection.select(".iobio-multi-line.line-panel").node())
              selection
                .append("div")
                .attr("class", "iobio-multi-line line-panel")
                .style("height", parseInt(h) + "px");
            if (!options.noLine || selected != "all") {
              // Create line div to place the line chart in
              // Call base line chart
              if (selected == "all") {
                // for all
                lineBase
                  .yAxis(yAxis)
                  .xAxis(null)
                  .call(
                    this,
                    selection.select(".line-panel").datum(smooth(points)),
                    options,
                  );
                // Remove brush for all
                selection.select(".iobio-brush").selectAll("*").remove();
                selection.select(".iobio-axis.iobio-x").selectAll("*").remove();
              } else {
                chart.selectedGlobalpos = selectedGlobalpos;
                points.forEach(function (d) {
                  d.globalPos = 0;
                });
                if (points.length > 0) {
                  x.domain([points[0].pos, points.slice(-1)[0].pos]);
                  lineBase
                    .yAxis(yAxis)
                    .xAxis(xAxis.scale(x))
                    .call(
                      this,
                      selection.select(".line-panel").datum(smooth(points)),
                      options,
                    );
                }
              }
            } else {
              var maxX =
                points[points.length - 1].globalPos +
                xValue(points[points.length - 1]);
              x.range([0, w - m.left - m.right]).domain([0, maxX]);
            }

            // Create buttons
            selection
              .selectAll(".iobio-multi-line.button-panel")
              .data([0])
              .enter()
              .append("div")
              .attr("class", "iobio-multi-line button-panel")
              .style("width", w - m.left - m.right)
              .append("svg")
              .style("width", "100%")
              .style("margin-left", m.left + "px");

            var button = selection
              .select(".button-panel svg")
              .selectAll(".button")
              .data(selection.datum(), function (d, i) {
                return nameValue(d, i);
              });

            // Exit
            button.exit().style("display", "none");

            // Enter
            var buttonEnter = button
              .enter()
              .append("g")
              .attr("class", "button")
              .attr("transform", function (d) {
                return "translate(" + x(d.globalPos) + ")";
              })
              .attr("id", function (d, i) {
                return "iobio-button-" + nameValue(d, i);
              });

            buttonEnter
              .append("rect")
              .attr("width", function (d, i) {
                var data = dataValue(d, i);
                var last =
                  parseInt(xValue(data[data.length - 1], i)) +
                  parseInt(d.globalPos);
                var xpos = x(last) - x(parseInt(d.globalPos));
                return xpos + "px";
              })
              .style("fill", color)
              .attr("height", "20px")
              .append("title")
              .text(nameValue);

            buttonEnter
              .append("text")
              .attr("y", 10)
              .attr("x", function (d, i) {
                var data = dataValue(d, i);
                var last =
                  parseInt(xValue(data[data.length - 1], i)) +
                  parseInt(d.globalPos);
                var xpos = (x(last) - x(parseInt(d.globalPos))) / 2;
                return xpos + "px";
              })
              .attr("alignment-baseline", "middle")
              .attr("text-anchor", "middle");

            // Update
            button
              .transition()
              .duration(transitionDuration)
              .style("display", function (d, i) {
                if (selected == "all" || selected == nameValue(d, i))
                  return "block";
                else return "none";
              })
              .attr("transform", function (d, i) {
                return "translate(" + x(d.globalPos) + ")";
              });

            button
              .select("rect")
              .transition()
              .duration(transitionDuration)
              .attr("width", function (d, i) {
                var data = dataValue(d, i);
                var last =
                  parseInt(xValue(data[data.length - 1], i)) +
                  parseInt(d.globalPos);
                var xpos = x(last) - x(parseInt(d.globalPos));
                return xpos + "px";
              });

            button
              .select("text")
              .transition()
              .duration(transitionDuration)
              .attr("x", function (d, i) {
                var data = dataValue(d, i);
                var last =
                  parseInt(xValue(data[data.length - 1], i)) +
                  parseInt(d.globalPos);
                var xpos = (x(last) - x(parseInt(d.globalPos))) / 2;
                return xpos + "px";
              })
              .text(function (d, i) {
                // get rect width
                var data = dataValue(d, i);
                var last =
                  parseInt(xValue(data[data.length - 1], i)) +
                  parseInt(d.globalPos);
                var rectWidth = x(last) - x(parseInt(d.globalPos));

                // get text width
                var name = nameValue(d, i);
                this.textContent = name;
                var textWidth = this.getComputedTextLength();

                if (textWidth <= rectWidth) return name;
              });

            // Attach events
            var userClickCB;
            events.forEach(function (ev) {
              if (ev.event == "click") userClickCB = ev.listener;
              else button.on(ev.event, ev.listener);
            });

            // Add control click event to all buttons
            button.on("click", function (d, i) {
              var xMin = d.globalPos;
              var xMax = d.globalPos + xValue(d.data[d.data.length - 1], i);
              chart(selection, {
                selected: nameValue(d, i),
                yMin: yMin,
                yMax: yMax,
              });
              // chart(selection, {'xMin': xMin, 'xMax': xMax, 'selected':nameValue(d) });

              // Handle user event
              if (userClickCB) userClickCB.call(this, d);
            });
            if (selected != "all") {
              selection
                .select(".line-panel .iobio-container")
                .append("text")
                .attr("id", "iobio-button-all")
                .attr("x", m.left + 5)
                .attr("y", 0)
                .text("< All")
                .on("click", function () {
                  this.remove();
                  chart(selection, options);
                  if (userClickCB) userClickCB.call(this);
                });
            }
          }

          // Rebind methods in line chart to this chart
          lineBase.rebind(chart);

          // Member functions
          chart.dataValue = function (_) {
            if (!arguments.length) return dataValue;
            dataValue = _;
            return chart;
          };

          chart.color = function (_) {
            if (!arguments.length) return color;
            color = _;
            return chart;
          };

          chart.epsilonRate = function (_) {
            if (!arguments.length) return epsilonRate;
            epsilonRate = _;
            return chart;
          };

          chart.nameValue = function (_) {
            if (!arguments.length) return nameValue;
            nameValue = _;
            return chart;
          };

          chart.getSelected = function (_) {
            return selected;
          };

          chart.setSelected = function (_, opts) {
            var options = {};
            extend(options, opts, { selected: _ });
            chart(this.selection, options);
            return chart;
          };

          chart.lineChart = function (_) {
            if (!arguments.length) return lineBase;
            lineBase = _;
            return chart;
          };

          chart.trigger = function (event, buttonName) {
            this.selection
              .select("#iobio-button-" + buttonName)
              .each(function (d, i) {
                var data = d.find(function (d) {
                  return nameValue(d) == buttonName;
                });
                var onEventFunc = d3.select(this).on(event);
                if (onEventFunc) onEventFunc.apply(this, [data, i]);
              });
          };

          /*
           * Set events on buttons
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          return chart;
        };

        // Export alignment
        module.exports = multiLine;
      },
      { "../utils.js": 11, "./line.js": 20, extend: 2 },
    ],
    22: [
      function (require, module, exports) {
        var pie = function () {
          // Import base chart
          var base = require("./base.js")(),
            utils = require("../utils.js"),
            extend = require("extend");

          // Initialize
          var total = 0;

          // Defaults
          var radius = 90,
            innerRadius = 0,
            padding = 0,
            arc,
            events = [],
            tooltip,
            nameValue = "",
            text = function (data, total) {
              var count = data[0].data;
              var percent = utils.format_percent(count / total);
              return (
                "<div class='iobio-percent'>" +
                percent +
                "%</div><div class='iobio-count'>" +
                count +
                "</div>"
              );
            };

          // Default Options
          var defaults = {};

          function chart(selection, opts) {
            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            // Update arc
            arc = d3.svg.arc().outerRadius(radius).innerRadius(innerRadius);

            // Call base chart
            base
              // .width(radius*2 + padding)
              // .height(radius*2 + padding)
              .xAxis(null)
              .yAxis(null);
            base.call(this, selection, options);

            // Grab base functions for easy access
            var color = base.color(),
              id = base.id(),
              transitionDuration = base.transitionDuration();

            // Get Total
            total = 0;
            selection.datum().forEach(function (d) {
              total += d.data;
            });

            // Get bounding dimenions
            var boundingCR = base.getBoundingClientRect();

            // Draw
            var g = selection
              .select("g.iobio-container")
              .classed("iobio-pie", true)
              .attr(
                "transform",
                "translate(" +
                  boundingCR.width / 2 +
                  "," +
                  boundingCR.height / 2 +
                  ")",
              ); // grab container to draw into (created by base chart)
            var path = g.selectAll(".arc").data(selection.datum());

            // enter
            var pathEnter = path
              .enter()
              .append("g")
              .attr("id", id)
              .attr("class", "arc")
              .style("fill", color);

            pathEnter
              .append("path")
              .attr("d", function (d, i) {
                if (transitionDuration && transitionDuration > 0) {
                  return arc({
                    data: d.data,
                    value: 0,
                    startAngle: 0,
                    endAngle: 0,
                    padAngle: 0,
                  });
                } else {
                  return arc(d);
                }
              })
              .each(function (d) {
                this._current = {
                  data: d.data,
                  value: 0,
                  startAngle: 0,
                  endAngle: 0,
                  padAngle: 0,
                }; // store the initial angles
              });

            pathEnter
              .append("text")
              .attr("transform", function (d) {
                return "translate(" + arcLabelPosition(d, 0.5) + ")";
              })
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "middle");

            // update
            if (transitionDuration != undefined && transitionDuration >= 0) {
              path
                .style("fill", color)
                .select("path")
                .transition()
                .duration(transitionDuration)
                .attrTween("d", arcTween)
                .call(utils.endAll, function () {
                  var event = events.find(function (e) {
                    return e.event == "end";
                  });
                  if (event) {
                    event.listener.call(chart);
                  }
                });

              path
                .select("text")
                .transition()
                .duration(transitionDuration)
                .attr("transform", function (d) {
                  var angle = arcLabelAngle(d, 0.55) * (180 / Math.PI) - 180;
                  return (
                    "translate(" +
                    arcLabelPosition(d, 0.55) +
                    ") rotate(" +
                    angle +
                    ")"
                  );
                })
                .text(function (d, i) {
                  if (!nameValue) return;
                  var h = (chart.innerRadius() + chart.radius()) * 0.55;
                  var oa = arc.startAngle.call(d)(d);
                  var ia = arc.endAngle.call(d)(d);
                  var a = ia - oa;
                  var width = Math.sin(a / 2) * h * 2;
                  var fontSize = parseInt(d3.select(this).style("font-size"));
                  if (fontSize <= width) return nameValue(d, i);
                });
            }

            // exit
            path.exit().remove();

            // Add middle text
            g.selectAll(".iobio-center-text")
              .data([0])
              .enter()
              .append("foreignObject")
              .attr("x", -innerRadius)
              .attr("y", -18)
              .attr("width", innerRadius * 2)
              .attr("height", innerRadius * 2)
              .attr("class", "iobio-center-text");
            // .append("xhtml:div")

            g.selectAll(".iobio-center-text").html(
              text(selection.datum(), total),
            );
            // g.selectAll('.iobio-center-text').text( text(selection.datum(), total) );

            // Add title on hover
            if (tooltip) {
              var tt = d3.select(".iobio-tooltip");
              utils.tooltipHelper(g.selectAll(".arc"), tt, tooltip);
            }

            // Attach events
            events.forEach(function (ev) {
              path.on(ev.event, ev.listener);
            });
          }
          // Rebind methods in base.js to this chart
          base.rebind(chart);

          // Store the displayed angles in _current.
          // Then, interpolate from _current to the new angles.
          // During the transition, _current is updated in-place by d3.interpolate.
          function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
              return arc(i(t));
            };
          }

          function arcLabelAngle(d, ratio) {
            var r = (chart.innerRadius() + chart.radius()) * ratio;
            var oa = arc.startAngle.call(d);
            var ia = arc.endAngle.call(d);
            a = (oa(d) + ia(d)) / 2 - Math.PI / 2;
            return a;
          }

          function arcLabelPosition(d, ratio) {
            var r = (chart.innerRadius() + chart.radius()) * ratio;
            var a = arcLabelAngle(d, ratio);
            return [Math.cos(a) * r, Math.sin(a) * r];
          }

          chart.padding = function (_) {
            if (!arguments.length) return padding;
            padding = _;
            return chart;
          };

          chart.radius = function (_) {
            if (!arguments.length) return radius;
            radius = _;
            return chart;
          };

          chart.innerRadius = function (_) {
            if (!arguments.length) return innerRadius;
            innerRadius = _;
            return chart;
          };

          chart.nameValue = function (_) {
            if (!arguments.length) return nameValue;
            nameValue = _;
            return chart;
          };

          chart.text = function (_) {
            if (!arguments.length) return text;
            text = _;
            return text;
          };

          /*
           * Set events on rects
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover rects
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          return chart;
        };

        // Export alignment
        module.exports = pie;
      },
      { "../utils.js": 11, "./base.js": 15, extend: 2 },
    ],
    23: [
      function (require, module, exports) {
        /*
  pieChooser - a iobio viz component that is a pie chart with clickable slices.  All slices
               can be selected by clicking the 'All' circle in the middle of the pie chart.
*/
        var pieChooser = function () {
          // Import base chart
          var base = require("./base.js")(),
            pie = require("./pie.js")(),
            utils = require("../utils.js"),
            extend = require("extend");

          // Defaults
          var events = [],
            eventMap = {},
            tooltip;

          // Default Options
          var defaults = {};

          var name = function (d) {
            return d.data.name;
          };

          var chartContainer = null;

          var clickedSlice = null;
          var clickedSlices = [];

          var sliceApiSelected = null;
          var arcs = null;
          var radiusOffset;
          var arc;
          var options;
          var labels;
          var text;

          function chart(selection, opts) {
            // Merge defaults and options
            options = {};
            extend(options, defaults, opts);
            chartContainer = selection;

            arc = d3.svg
              .arc()
              .innerRadius(chart.innerRadius())
              .outerRadius(chart.radius());

            // Stick events in map for easy lookup
            events.forEach(function (ev) {
              eventMap[ev.event] = ev.listener;
            });

            // Create a pie chart
            pie
              .nameValue(name)
              .radius(chart.radius())
              .innerRadius(chart.innerRadius())
              .padding(chart.padding())
              .transitionDuration(200)
              .color(chart.color())
              .text(function (d, i) {
                return "";
              });

            var listener = eventMap["end"];
            if (listener) {
              pie.on("end", function () {
                listener.call(chart);
              });
            }

            pie(selection, options);

            arcs = selection.selectAll(".arc");

            // Handle movements of arcs during mouseover and click
            arcs
              .on("mouseover", function (d, i) {
                d3.select(this).attr("cursor", "pointer");
                chart._selectSlice.call(this, d, i, null, true);

                d3.select(this)
                  .select("path")
                  .style("stroke", "darkturquoise")
                  .style("stroke-width", "2")
                  .style("opacity", 1);
                if (tooltip) {
                  utils.showTooltip(d3.select(".iobio-tooltip"), tooltip, d);
                }

                var listener = eventMap["mouseover"];
                if (listener) {
                  listener.call(chart, d, i);
                }
              })
              .on("mouseout", function (d) {
                d3.select(this).attr("cursor", "default");
                if (clickedSlices.length == 0 && this != clickedSlice) {
                  d3.select(this)
                    .select("path")
                    .transition()
                    .duration(150)
                    .attr("transform", "translate(0,0)");
                }

                d3.select(this).select("path").style("stroke-width", "0");

                if (tooltip) {
                  utils.hideTooltip(d3.select(".iobio-tooltip"));
                }

                var listener = eventMap["mouseout"];
                if (listener) {
                  listener.call(chart, d, i);
                }
              })
              .on("click", function (d, i) {
                chart._clickSlice(this, d, i, true);

                var listener = eventMap["click"];
                if (listener) {
                  listener.call(chart, d, i);
                }
              });

            // ALL circle inside of donut chart for selecting all pieces
            var g = selection.select(".iobio-pie");
            g.append("circle")
              .attr("id", "all-circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 25)
              .attr("stroke", "lightgrey")
              .attr("fill", "transparent")
              .style("pointer-events", "all")
              .on("mouseover", function (d) {
                d3.select(this).attr("cursor", "pointer");
              })
              .on("mouseout", function (d) {
                d3.select(this).attr("cursor", "default");
              })
              .on("click", function (d) {
                d3.select(this).classed("selected", true);
                chart._clickAllSlices(d);
                var listener = eventMap["clickall"];
                if (listener) {
                  listener.call(chart, d);
                }
              });
            g.append("text")
              .attr("id", "all-text")
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .style("pointer-events", "none")
              .attr("class", "inside")
              .text(function (d) {
                return "All";
              });
            // .each('end', function() { console.log('ennennendndndndnd')});
            selection.select("foreignObject").style("pointer-events", "none");
          }
          // Rebind methods in pie.js to this chart
          base.rebind(chart);

          /*
           * Set events on arcs
           */
          chart.on = function (event, listener) {
            if (!arguments.length) {
              return events;
            }
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover arcs
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          chart.name = function (_) {
            if (!arguments.length) return name;
            name = _;
            return name;
          };

          chart.text = function (_) {
            if (!arguments.length) return text;
            text = _;
            return text;
          };

          chart.padding = function (_) {
            if (!arguments.length) return padding;
            padding = _;
            return chart;
          };

          chart.radius = function (_) {
            if (!arguments.length) return radius;
            radius = _;
            return chart;
          };

          chart.innerRadius = function (_) {
            if (!arguments.length) return innerRadius;
            innerRadius = _;
            return chart;
          };

          chart._clickSlice = function (theSlice, d, i, singleSelection) {
            if (singleSelection) {
              chartContainer
                .select("circle#all-circle.selected")
                .classed("selected", false);
            }

            if (singleSelection) {
              if (clickedSlices.length > 0) {
                for (var i = 0; i < clickedSlices.length; i++) {
                  chart._unclickSlice(clickedSlices[i]);
                }
                clickedSlices.length = 0;
              } else if (clickedSlice) {
                chart._unclickSlice(clickedSlice);
              }
            }

            // Bold the label of the clicked slice
            d3.select(theSlice)
              .selectAll("text")
              .attr("class", "chartlabelSelected");

            // Offset the arc even more than mouseover offset
            // Calculate angle bisector
            var ang = d.startAngle + (d.endAngle - d.startAngle) / 2;
            // Transformate to SVG space
            ang = (ang - Math.PI / 2) * -1;

            // Calculate a 10% radius displacement
            var x = Math.cos(ang) * radius * 0.1;
            var y = Math.sin(ang) * radius * -0.1;

            d3.select(theSlice)
              .select("path")
              .attr("transform", "rotate(0)")
              .transition()
              .duration(200)
              .attr("transform", "translate(" + x + "," + y + ")");

            if (singleSelection) {
              clickedSlice = theSlice;
            } else {
              clickedSlices.push(theSlice);
            }
          };

          chart._unclickSlice = function (clickedSlice) {
            // change the previous clicked slice back to no offset
            d3.select(clickedSlice)
              .select("path")
              .transition()
              .duration(150)
              .attr("transform", "translate(0,0)");

            // change the previous clicked slice label back to normal font
            d3.select(clickedSlice)
              .selectAll("text")
              .attr("class", "chartlabel");
            var labelPos = chart._arcLabelPosition(clickedSlice.__data__, 0.55);

            return chart;
          };

          chart._selectSlice = function (d, i, gNode, deselectPrevSlice) {
            var theSlice = this;

            // We have a gNode when this function is
            // invoked during initialization to selected
            // the first slice.
            if (gNode) {
              theSlice = gNode;
              sliceApiSelected = gNode;
            } else {
              // We have to get rid of previous selection
              // when we mouseenter after first chromsome
              // was auto selected because mouseout
              // event not triggered when leaving first
              // selected slice.
              if (deselectPrevSlice) {
                if (sliceApiSelected) {
                  d3.select(sliceApiSelected)
                    .select("path")
                    .transition()
                    .duration(150)
                    .attr("transform", "translate(0,0)");
                  sliceApiSelected = null;
                }
              }
            }

            // show tooltip
            if (options.showTooltip) {
              _tooltip().transition().duration(200).style("opacity", 0.9);

              var centroid = arc.centroid(d);

              var matrix = theSlice
                .getScreenCTM()
                .translate(
                  +theSlice.getAttribute("cx"),
                  +theSlice.getAttribute("cy"),
                );
              // position tooltip
              _tooltip()
                .html(name(d.data))
                .style("visibility", "visible")
                .style("left", matrix.e + centroid[0] + "px")
                .style("top", matrix.f + centroid[1] - 18 + "px");
            }

            if (theSlice != clickedSlice) {
              // Calculate angle bisector
              var ang = d.startAngle + (d.endAngle - d.startAngle) / 2;
              // Transformate to SVG space
              ang = (ang - Math.PI / 2) * -1;

              // Calculate a .5% radius displacement (inverse to make slice to inward)
              var x = Math.cos(ang) * radius * 0.1;
              var y = Math.sin(ang) * radius * -0.1;
              d3.select(theSlice)
                .select("path")
                .attr("transform", "rotate(0)")
                .transition()
                .duration(200)
                .attr("transform", "translate(" + x + "," + y + ")");
            }
            return chart;
          };

          chart._arcLabelPosition = function (d, ratio) {
            var r = (chart.innerRadius() + chart.radius()) * ratio;
            var oa = arc.startAngle.call(d);
            var ia = arc.endAngle.call(d);
            a = (oa(d) + ia(d)) / 2 - Math.PI / 2;
            return [Math.cos(a) * r, Math.sin(a) * r];
          };

          chart._clickAllSlices = function (data) {
            chartContainer
              .select("circle#all-circle")
              .classed("selected", true);

            clickedSlices.length = 0;
            for (var i = 0; i < data.length; i++) {
              var theSlice = arcs.selectAll("d.arc")[i].parentNode;
              chart._clickSlice(theSlice, theSlice.__data__, i, false);
            }
            return chart;
          };

          chart.clickSlice = function (i) {
            var theSlice = arcs.selectAll("d.arc")[i].parentNode;
            chart._clickSlice(theSlice, theSlice.__data__, i, true);
            chart._selectSlice(theSlice.__data__, i, theSlice);
            clickedSlice = theSlice;
            return chart;
          };

          chart.clickAllSlices = function (data) {
            chart._clickAllSlices(data);
            return chart;
          };

          return chart;
        };

        // Export alignment
        module.exports = pieChooser;
      },
      { "../utils.js": 11, "./base.js": 15, "./pie.js": 22, extend: 2 },
    ],
    24: [
      function (require, module, exports) {
        var scatter = function () {
          // Import base chart
          var base = require("./base.js")(),
            utils = require("../utils.js"),
            extend = require("extend");

          // Defaults
          var events = [],
            tooltip,
            keyValue,
            klass = "",
            symbol = "x";

          // Default Options
          var defaults = { yMin: 0 };

          function chart(selection, opts) {
            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            // Call base chart
            base.call(this, selection, options);

            // Grab base functions for easy access
            var y = base.y(),
              x = base.x(),
              id = base.id(),
              xValue = base.xValue(),
              yValue = base.yValue(),
              wValue = base.wValue(),
              keyValue = base.keyValue(),
              color = base.color(),
              transitionDuration = base.transitionDuration(),
              innerHeight =
                base.height() - base.margin().top - base.margin().bottom;

            if (innerHeight < 0) {
              console.log(
                "Negative inner height " +
                  innerHeight +
                  " calculated for scatter chart. Change height or margins.",
              );
              console.trace();
              return;
            }

            // Draw
            // enter
            var g = selection
              .select("g.iobio-container")
              .classed("iobio-scatter", true); // grab container to draw into (created by base chart)
            var dot = g.selectAll(".dot").data(selection.datum(), keyValue);
            // exit
            dot.exit().remove();

            if (symbol == "circle") {
              // enter
              dot
                .enter()
                .append("g")
                .attr("id", id)
                .style("fill", color)
                .append("circle")
                .attr("cy", function (d, i) {
                  return y(yValue(d, i));
                })
                .attr("cx", function (d, i) {
                  return x(xValue(d, i));
                })
                .attr("r", function (d, i) {
                  return 0;
                });

              // update
              dot
                .attr("class", function (d, i) {
                  return "dot " + utils.value_accessor(klass, d, i);
                })
                .style("fill", color)
                .select("circle")
                .transition()
                .duration(transitionDuration)
                .attr("cx", function (d, i) {
                  return x(xValue(d, i));
                })
                .attr("cy", function (d, i) {
                  return y(yValue(d, i));
                })
                .attr("r", function (d, i) {
                  return (x(xValue(d, i) + wValue(d, i)) - x(xValue(d, i))) / 2;
                });
            } else if (symbol == "x") {
              // enter
              dot
                .enter()
                .append("g")
                .attr("id", id)
                .attr("class", "dot")
                .style("fill", color)
                .style("font-size", "0.1")
                .append("text")
                .attr("x", function (d, i) {
                  return x(xValue(d, i));
                })
                .attr("y", function (d, i) {
                  return y(yValue(d, i));
                })
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .text("x");

              // update
              dot
                .attr("class", function (d, i) {
                  return "dot " + utils.value_accessor(klass, d, i);
                })
                .transition()
                .duration(transitionDuration)
                .style("fill", color)
                .style("font-size", function (d, i) {
                  return x(xValue(d, i) + wValue(d, i)) - x(xValue(d, i));
                })
                .select("text")
                .attr("x", function (d, i) {
                  return x(xValue(d, i));
                })
                .attr("y", function (d, i) {
                  return y(yValue(d, i));
                })
                .text("x");
            }

            // Add title on hover
            if (tooltip) {
              var tt = d3.select(".iobio-tooltip");
              utils.tooltipHelper(g.selectAll(".dot"), tt, tooltip);
            }

            // Attach events
            events.forEach(function (ev) {
              dot.on(ev.event, ev.listener);
            });
          }
          // Rebind methods in base.js to this chart
          base.rebind(chart);

          /*
           * Set events on dots
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover dots
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          /*
           * Set class on the g element of each symbol
           */
          chart.class = function (_) {
            if (!arguments.length) return klass;
            klass = _;
            return chart;
          };

          /*
           * Set type of symbol to draw
           */
          chart.symbol = function (_) {
            if (!arguments.length) return symbol;
            symbol = _;
            return chart;
          };

          /*
           * Easy method to rebind scatter chart functions to the argument chart
           */
          chart.rebind = function (object) {
            base.rebind(object);
            utils.rebind(object, this, "rebind", "class", "symbol");
          };

          return chart;
        };

        // Export alignment
        module.exports = scatter;
      },
      { "../utils.js": 11, "./base.js": 15, extend: 2 },
    ],
    25: [
      function (require, module, exports) {
        var scatterViewer = function () {
          // Import base chart
          var scatter = require("./scatter.js"),
            utils = require("../utils.js"),
            extend = require("extend");

          // Defaults
          var events = [],
            tooltip,
            sizeRatio = 0.8,
            origHeight;

          // Default Options
          var defaults = {};

          // Base Chart
          var basescatter = scatter();

          function chart(selection, opts) {
            // Merge defaults and options
            var options = {};
            extend(options, defaults, opts);

            origHeight = chart.height();

            // Setup both chart divs
            selection
              .selectAll("div")
              .data([0, 0])
              .enter()
              .append("div")
              .attr("class", function (d, i) {
                return "iobio-scatter-" + i + " iobio-scatterViewer";
              });

            // Call big scatter chart
            var focalscatter = scatter()
              .height(origHeight * sizeRatio)
              .xValue(chart.xValue())
              .yValue(chart.yValue())
              .wValue(chart.wValue())
              .xAxis(chart.xAxis())
              .yAxis(chart.yAxis())
              .symbol(chart.symbol())
              .class(chart.class())
              .margin(chart.margin())
              .width(chart.width())
              .y(chart.y())
              .x(chart.x())
              .id(chart.id())
              .color(chart.color())
              .tooltip(chart.tooltip())
              .transitionDuration(chart.transitionDuration());

            var focalSelection = selection
              .select(".iobio-scatter-0")
              .datum(selection.datum());
            focalscatter(focalSelection, options);

            // Call little scatter chart
            var globalscatter = scatter()
              .xValue(chart.xValue())
              .yValue(chart.yValue())
              .wValue(chart.wValue())
              .xAxis(chart.xAxis())
              .yAxis(null)
              .symbol(chart.symbol())
              .class(chart.class())
              .margin(chart.margin())
              .width(chart.width())
              .transitionDuration(chart.transitionDuration())
              .id(chart.id())
              .color(chart.color())
              .tooltip(chart.tooltip())
              .height(origHeight * (1 - sizeRatio))
              .brush("brush", function () {
                var x2 = globalscatter.x(),
                  brush = globalscatter.brush();
                var x = brush.empty() ? x2.domain() : brush.extent();
                var datum = globalSelection.datum().filter(function (d, i) {
                  return (
                    globalscatter.xValue()(d, i) >= x[0] &&
                    globalscatter.xValue()(d, i) <= x[1]
                  );
                });
                options.xMin = x[0];
                options.xMax = x[1];
                options.globalscatter = globalscatter;
                focalscatter(focalSelection.datum(datum), options);
              });

            var globalSelection = selection
              .select(".iobio-scatter-1")
              .datum(selection.datum());
            globalscatter(globalSelection, options);

            // // Add title on hover
            //    if (tooltip) {
            //    	var tt = d3.select('.iobio-tooltip')
            //    	utils.tooltipHelper(g.selectAll('.rect'), tt, tooltip);
            //    }

            //    // Attach events
            // events.forEach(function(ev) {
            // 	var cb = ev.listener ? function() {ev.listener.call(chart, svg)} : null;
            // 	g.selectAll('.rect').on(ev.event, cb);
            // })
            // focalscatter.rebind(this);
          }

          // Rebind methods in scatter chart to this chart
          basescatter.rebind(chart);

          /*
           * Set events on rects
           */
          chart.sizeRatio = function (_) {
            if (!arguments.length) return sizeRatio;
            sizeRatio = _;
            return chart;
          };

          /*
           * Set events on rects
           */
          chart.on = function (event, listener) {
            if (!arguments.length) return events;
            events.push({ event: event, listener: listener });
            return chart;
          };

          /*
           * Set tooltip that appears when mouseover rects
           */
          chart.tooltip = function (_) {
            if (!arguments.length) return tooltip;
            tooltip = _;
            return chart;
          };

          return chart;
        };

        // Export alignment
        module.exports = scatterViewer;
      },
      { "../utils.js": 11, "./scatter.js": 24, extend: 2 },
    ],
    26: [
      function (require, module, exports) {
        var viz = {};
        // add visualizations
        viz.base = require("./base.js");
        viz.pie = require("./pie.js");
        viz.pieChooser = require("./pieChooser.js");
        viz.alignment = require("./alignment.js");
        viz.line = require("./line.js");
        viz.bar = require("./bar.js");
        viz.barViewer = require("./barViewer.js");
        viz.gene = require("./gene.js");
        viz.multiLine = require("./multiLine.js");
        viz.box = require("./box.js");
        viz.boxViewer = require("./boxViewer.js");
        viz.boxViewer2 = require("./boxViewer2.js");
        viz.scatter = require("./scatter.js");
        viz.scatterViewer = require("./scatterViewer.js");

        module.exports = viz;
      },
      {
        "./alignment.js": 12,
        "./bar.js": 13,
        "./barViewer.js": 14,
        "./base.js": 15,
        "./box.js": 16,
        "./boxViewer.js": 17,
        "./boxViewer2.js": 18,
        "./gene.js": 19,
        "./line.js": 20,
        "./multiLine.js": 21,
        "./pie.js": 22,
        "./pieChooser.js": 23,
        "./scatter.js": 24,
        "./scatterViewer.js": 25,
      },
    ],
  },
  {},
  [1],
);

//# sourceMappingURL=iobio.viz.js.map
