/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/page-contents/[page]/route";
exports.ids = ["app/api/page-contents/[page]/route"];
exports.modules = {

/***/ "(rsc)/./app/api/page-contents/[page]/route.ts":
/*!***********************************************!*\
  !*** ./app/api/page-contents/[page]/route.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _server_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/server/db */ \"(rsc)/./server/db.ts\");\n/* harmony import */ var _shared_schema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/shared/schema */ \"(rsc)/./shared/schema.ts\");\n/* harmony import */ var drizzle_orm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! drizzle-orm */ \"(rsc)/./node_modules/drizzle-orm/sql/expressions/conditions.js\");\n\n\n\n\n// GET /api/page-contents/[page] - Get page content by page name\nasync function GET(request, { params }) {\n    try {\n        const { page } = params;\n        if (!page) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid page name'\n            }, {\n                status: 400\n            });\n        }\n        const content = await _server_db__WEBPACK_IMPORTED_MODULE_1__.db.query.pageContents.findFirst({\n            where: (0,drizzle_orm__WEBPACK_IMPORTED_MODULE_3__.eq)(_shared_schema__WEBPACK_IMPORTED_MODULE_2__.pageContents.page, page)\n        });\n        if (!content) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Page content not found'\n            }, {\n                status: 404\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(content);\n    } catch (error) {\n        console.error('Error fetching page content:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch page content'\n        }, {\n            status: 500\n        });\n    }\n}\n// PUT /api/page-contents/[page] - Update page content (protected)\nasync function PUT(request, { params }) {\n    try {\n        // Check authentication - to be implemented later\n        // const session = await getServerSession();\n        // if (!session || !session.user) {\n        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });\n        // }\n        const { page } = params;\n        if (!page) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid page name'\n            }, {\n                status: 400\n            });\n        }\n        const body = await request.json();\n        if (!body.content) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Missing content'\n            }, {\n                status: 400\n            });\n        }\n        // Check if the page content exists\n        const existingContent = await _server_db__WEBPACK_IMPORTED_MODULE_1__.db.query.pageContents.findFirst({\n            where: (0,drizzle_orm__WEBPACK_IMPORTED_MODULE_3__.eq)(_shared_schema__WEBPACK_IMPORTED_MODULE_2__.pageContents.page, page)\n        });\n        const now = new Date().toISOString();\n        if (existingContent) {\n            // Update existing content\n            const updatedContent = await _server_db__WEBPACK_IMPORTED_MODULE_1__.db.update(_shared_schema__WEBPACK_IMPORTED_MODULE_2__.pageContents).set({\n                content: body.content,\n                updatedAt: now\n            }).where((0,drizzle_orm__WEBPACK_IMPORTED_MODULE_3__.eq)(_shared_schema__WEBPACK_IMPORTED_MODULE_2__.pageContents.page, page)).returning();\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(updatedContent[0]);\n        } else {\n            // Create new content\n            const newContent = await _server_db__WEBPACK_IMPORTED_MODULE_1__.db.insert(_shared_schema__WEBPACK_IMPORTED_MODULE_2__.pageContents).values({\n                page,\n                content: body.content,\n                updatedAt: now\n            }).returning();\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(newContent[0], {\n                status: 201\n            });\n        }\n    } catch (error) {\n        console.error('Error updating page content:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to update page content'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3BhZ2UtY29udGVudHMvW3BhZ2VdL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUF3RDtBQUN2QjtBQUNjO0FBQ2Q7QUFFakMsZ0VBQWdFO0FBQ3pELGVBQWVJLElBQ3BCQyxPQUFvQixFQUNwQixFQUFFQyxNQUFNLEVBQWdDO0lBRXhDLElBQUk7UUFDRixNQUFNLEVBQUVDLElBQUksRUFBRSxHQUFHRDtRQUVqQixJQUFJLENBQUNDLE1BQU07WUFDVCxPQUFPUCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUFvQixHQUM3QjtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTUMsVUFBVSxNQUFNViwwQ0FBRUEsQ0FBQ1csS0FBSyxDQUFDVixZQUFZLENBQUNXLFNBQVMsQ0FBQztZQUNwREMsT0FBT1gsK0NBQUVBLENBQUNELHdEQUFZQSxDQUFDSyxJQUFJLEVBQUVBO1FBQy9CO1FBRUEsSUFBSSxDQUFDSSxTQUFTO1lBQ1osT0FBT1gscURBQVlBLENBQUNRLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBeUIsR0FDbEM7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLE9BQU9WLHFEQUFZQSxDQUFDUSxJQUFJLENBQUNHO0lBQzNCLEVBQUUsT0FBT0YsT0FBTztRQUNkTSxRQUFRTixLQUFLLENBQUMsZ0NBQWdDQTtRQUM5QyxPQUFPVCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQStCLEdBQ3hDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGO0FBRUEsa0VBQWtFO0FBQzNELGVBQWVNLElBQ3BCWCxPQUFvQixFQUNwQixFQUFFQyxNQUFNLEVBQWdDO0lBRXhDLElBQUk7UUFDRixpREFBaUQ7UUFDakQsNENBQTRDO1FBQzVDLG1DQUFtQztRQUNuQywwRUFBMEU7UUFDMUUsSUFBSTtRQUVKLE1BQU0sRUFBRUMsSUFBSSxFQUFFLEdBQUdEO1FBRWpCLElBQUksQ0FBQ0MsTUFBTTtZQUNULE9BQU9QLHFEQUFZQSxDQUFDUSxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQW9CLEdBQzdCO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxNQUFNTyxPQUFPLE1BQU1aLFFBQVFHLElBQUk7UUFFL0IsSUFBSSxDQUFDUyxLQUFLTixPQUFPLEVBQUU7WUFDakIsT0FBT1gscURBQVlBLENBQUNRLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBa0IsR0FDM0I7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLG1DQUFtQztRQUNuQyxNQUFNUSxrQkFBa0IsTUFBTWpCLDBDQUFFQSxDQUFDVyxLQUFLLENBQUNWLFlBQVksQ0FBQ1csU0FBUyxDQUFDO1lBQzVEQyxPQUFPWCwrQ0FBRUEsQ0FBQ0Qsd0RBQVlBLENBQUNLLElBQUksRUFBRUE7UUFDL0I7UUFFQSxNQUFNWSxNQUFNLElBQUlDLE9BQU9DLFdBQVc7UUFFbEMsSUFBSUgsaUJBQWlCO1lBQ25CLDBCQUEwQjtZQUMxQixNQUFNSSxpQkFBaUIsTUFBTXJCLDBDQUFFQSxDQUFDc0IsTUFBTSxDQUFDckIsd0RBQVlBLEVBQ2hEc0IsR0FBRyxDQUFDO2dCQUNIYixTQUFTTSxLQUFLTixPQUFPO2dCQUNyQmMsV0FBV047WUFDYixHQUNDTCxLQUFLLENBQUNYLCtDQUFFQSxDQUFDRCx3REFBWUEsQ0FBQ0ssSUFBSSxFQUFFQSxPQUM1Qm1CLFNBQVM7WUFFWixPQUFPMUIscURBQVlBLENBQUNRLElBQUksQ0FBQ2MsY0FBYyxDQUFDLEVBQUU7UUFDNUMsT0FBTztZQUNMLHFCQUFxQjtZQUNyQixNQUFNSyxhQUFhLE1BQU0xQiwwQ0FBRUEsQ0FBQzJCLE1BQU0sQ0FBQzFCLHdEQUFZQSxFQUM1QzJCLE1BQU0sQ0FBQztnQkFDTnRCO2dCQUNBSSxTQUFTTSxLQUFLTixPQUFPO2dCQUNyQmMsV0FBV047WUFDYixHQUNDTyxTQUFTO1lBRVosT0FBTzFCLHFEQUFZQSxDQUFDUSxJQUFJLENBQUNtQixVQUFVLENBQUMsRUFBRSxFQUFFO2dCQUFFakIsUUFBUTtZQUFJO1FBQ3hEO0lBQ0YsRUFBRSxPQUFPRCxPQUFPO1FBQ2RNLFFBQVFOLEtBQUssQ0FBQyxnQ0FBZ0NBO1FBQzlDLE9BQU9ULHFEQUFZQSxDQUFDUSxJQUFJLENBQ3RCO1lBQUVDLE9BQU87UUFBZ0MsR0FDekM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi9ob21lL3J1bm5lci93b3Jrc3BhY2UvYXBwL2FwaS9wYWdlLWNvbnRlbnRzL1twYWdlXS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgZGIgfSBmcm9tICdAL3NlcnZlci9kYic7XG5pbXBvcnQgeyBwYWdlQ29udGVudHMgfSBmcm9tICdAL3NoYXJlZC9zY2hlbWEnO1xuaW1wb3J0IHsgZXEgfSBmcm9tICdkcml6emxlLW9ybSc7XG5cbi8vIEdFVCAvYXBpL3BhZ2UtY29udGVudHMvW3BhZ2VdIC0gR2V0IHBhZ2UgY29udGVudCBieSBwYWdlIG5hbWVcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoXG4gIHJlcXVlc3Q6IE5leHRSZXF1ZXN0LFxuICB7IHBhcmFtcyB9OiB7IHBhcmFtczogeyBwYWdlOiBzdHJpbmcgfSB9XG4pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHBhZ2UgfSA9IHBhcmFtcztcbiAgICBcbiAgICBpZiAoIXBhZ2UpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ0ludmFsaWQgcGFnZSBuYW1lJyB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBkYi5xdWVyeS5wYWdlQ29udGVudHMuZmluZEZpcnN0KHtcbiAgICAgIHdoZXJlOiBlcShwYWdlQ29udGVudHMucGFnZSwgcGFnZSlcbiAgICB9KTtcbiAgICBcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ1BhZ2UgY29udGVudCBub3QgZm91bmQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDQgfVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGNvbnRlbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIHBhZ2UgY29udGVudDonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogJ0ZhaWxlZCB0byBmZXRjaCBwYWdlIGNvbnRlbnQnIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG5cbi8vIFBVVCAvYXBpL3BhZ2UtY29udGVudHMvW3BhZ2VdIC0gVXBkYXRlIHBhZ2UgY29udGVudCAocHJvdGVjdGVkKVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBVVChcbiAgcmVxdWVzdDogTmV4dFJlcXVlc3QsXG4gIHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IHBhZ2U6IHN0cmluZyB9IH1cbikge1xuICB0cnkge1xuICAgIC8vIENoZWNrIGF1dGhlbnRpY2F0aW9uIC0gdG8gYmUgaW1wbGVtZW50ZWQgbGF0ZXJcbiAgICAvLyBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbigpO1xuICAgIC8vIGlmICghc2Vzc2lvbiB8fCAhc2Vzc2lvbi51c2VyKSB7XG4gICAgLy8gICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICAvLyB9XG4gICAgXG4gICAgY29uc3QgeyBwYWdlIH0gPSBwYXJhbXM7XG4gICAgXG4gICAgaWYgKCFwYWdlKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6ICdJbnZhbGlkIHBhZ2UgbmFtZScgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgXG4gICAgaWYgKCFib2R5LmNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ01pc3NpbmcgY29udGVudCcgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayBpZiB0aGUgcGFnZSBjb250ZW50IGV4aXN0c1xuICAgIGNvbnN0IGV4aXN0aW5nQ29udGVudCA9IGF3YWl0IGRiLnF1ZXJ5LnBhZ2VDb250ZW50cy5maW5kRmlyc3Qoe1xuICAgICAgd2hlcmU6IGVxKHBhZ2VDb250ZW50cy5wYWdlLCBwYWdlKVxuICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICBcbiAgICBpZiAoZXhpc3RpbmdDb250ZW50KSB7XG4gICAgICAvLyBVcGRhdGUgZXhpc3RpbmcgY29udGVudFxuICAgICAgY29uc3QgdXBkYXRlZENvbnRlbnQgPSBhd2FpdCBkYi51cGRhdGUocGFnZUNvbnRlbnRzKVxuICAgICAgICAuc2V0KHtcbiAgICAgICAgICBjb250ZW50OiBib2R5LmNvbnRlbnQsXG4gICAgICAgICAgdXBkYXRlZEF0OiBub3dcbiAgICAgICAgfSlcbiAgICAgICAgLndoZXJlKGVxKHBhZ2VDb250ZW50cy5wYWdlLCBwYWdlKSlcbiAgICAgICAgLnJldHVybmluZygpO1xuICAgICAgXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24odXBkYXRlZENvbnRlbnRbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDcmVhdGUgbmV3IGNvbnRlbnRcbiAgICAgIGNvbnN0IG5ld0NvbnRlbnQgPSBhd2FpdCBkYi5pbnNlcnQocGFnZUNvbnRlbnRzKVxuICAgICAgICAudmFsdWVzKHtcbiAgICAgICAgICBwYWdlLFxuICAgICAgICAgIGNvbnRlbnQ6IGJvZHkuY29udGVudCxcbiAgICAgICAgICB1cGRhdGVkQXQ6IG5vd1xuICAgICAgICB9KVxuICAgICAgICAucmV0dXJuaW5nKCk7XG4gICAgICBcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihuZXdDb250ZW50WzBdLCB7IHN0YXR1czogMjAxIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciB1cGRhdGluZyBwYWdlIGNvbnRlbnQ6JywgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6ICdGYWlsZWQgdG8gdXBkYXRlIHBhZ2UgY29udGVudCcgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn0iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZGIiLCJwYWdlQ29udGVudHMiLCJlcSIsIkdFVCIsInJlcXVlc3QiLCJwYXJhbXMiLCJwYWdlIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiY29udGVudCIsInF1ZXJ5IiwiZmluZEZpcnN0Iiwid2hlcmUiLCJjb25zb2xlIiwiUFVUIiwiYm9keSIsImV4aXN0aW5nQ29udGVudCIsIm5vdyIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInVwZGF0ZWRDb250ZW50IiwidXBkYXRlIiwic2V0IiwidXBkYXRlZEF0IiwicmV0dXJuaW5nIiwibmV3Q29udGVudCIsImluc2VydCIsInZhbHVlcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/page-contents/[page]/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute&page=%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute&page=%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_runner_workspace_app_api_page_contents_page_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/page-contents/[page]/route.ts */ \"(rsc)/./app/api/page-contents/[page]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/page-contents/[page]/route\",\n        pathname: \"/api/page-contents/[page]\",\n        filename: \"route\",\n        bundlePath: \"app/api/page-contents/[page]/route\"\n    },\n    resolvedPagePath: \"/home/runner/workspace/app/api/page-contents/[page]/route.ts\",\n    nextConfigOutput,\n    userland: _home_runner_workspace_app_api_page_contents_page_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZwYWdlLWNvbnRlbnRzJTJGJTVCcGFnZSU1RCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGcGFnZS1jb250ZW50cyUyRiU1QnBhZ2UlNUQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZwYWdlLWNvbnRlbnRzJTJGJTVCcGFnZSU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PXN0YW5kYWxvbmUmcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDWTtBQUN6RjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcHAvYXBpL3BhZ2UtY29udGVudHMvW3BhZ2VdL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcInN0YW5kYWxvbmVcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvcGFnZS1jb250ZW50cy9bcGFnZV0vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9wYWdlLWNvbnRlbnRzL1twYWdlXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcGFnZS1jb250ZW50cy9bcGFnZV0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FwcC9hcGkvcGFnZS1jb250ZW50cy9bcGFnZV0vcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute&page=%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./server/db.ts":
/*!**********************!*\
  !*** ./server/db.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   db: () => (/* binding */ db),\n/* harmony export */   pool: () => (/* binding */ pool)\n/* harmony export */ });\n/* harmony import */ var _neondatabase_serverless__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @neondatabase/serverless */ \"(rsc)/./node_modules/@neondatabase/serverless/index.mjs\");\n/* harmony import */ var drizzle_orm_neon_serverless__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! drizzle-orm/neon-serverless */ \"(rsc)/./node_modules/drizzle-orm/neon-serverless/driver.js\");\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ws */ \"(rsc)/./node_modules/ws/wrapper.mjs\");\n/* harmony import */ var _shared_schema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/schema */ \"(rsc)/./shared/schema.ts\");\n\n\n\n\n_neondatabase_serverless__WEBPACK_IMPORTED_MODULE_0__.neonConfig.webSocketConstructor = ws__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\nif (!process.env.DATABASE_URL) {\n    throw new Error(\"DATABASE_URL must be set. Did you forget to provision a database?\");\n}\nconst pool = new _neondatabase_serverless__WEBPACK_IMPORTED_MODULE_0__.Pool({\n    connectionString: process.env.DATABASE_URL\n});\nconst db = (0,drizzle_orm_neon_serverless__WEBPACK_IMPORTED_MODULE_3__.drizzle)({\n    client: pool,\n    schema: _shared_schema__WEBPACK_IMPORTED_MODULE_2__\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zZXJ2ZXIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTREO0FBQ047QUFDbEM7QUFDdUI7QUFFM0NDLGdFQUFVQSxDQUFDSSxvQkFBb0IsR0FBR0YsMENBQUVBO0FBRXBDLElBQUksQ0FBQ0csUUFBUUMsR0FBRyxDQUFDQyxZQUFZLEVBQUU7SUFDN0IsTUFBTSxJQUFJQyxNQUNSO0FBRUo7QUFFTyxNQUFNQyxPQUFPLElBQUlWLDBEQUFJQSxDQUFDO0lBQUVXLGtCQUFrQkwsUUFBUUMsR0FBRyxDQUFDQyxZQUFZO0FBQUMsR0FBRztBQUN0RSxNQUFNSSxLQUFLVixvRUFBT0EsQ0FBQztJQUFFVyxRQUFRSDtJQUFNTixNQUFNQSw2Q0FBQUE7QUFBQyxHQUFHIiwic291cmNlcyI6WyIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL3NlcnZlci9kYi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb29sLCBuZW9uQ29uZmlnIH0gZnJvbSAnQG5lb25kYXRhYmFzZS9zZXJ2ZXJsZXNzJztcbmltcG9ydCB7IGRyaXp6bGUgfSBmcm9tICdkcml6emxlLW9ybS9uZW9uLXNlcnZlcmxlc3MnO1xuaW1wb3J0IHdzIGZyb20gXCJ3c1wiO1xuaW1wb3J0ICogYXMgc2NoZW1hIGZyb20gXCIuLi9zaGFyZWQvc2NoZW1hXCI7XG5cbm5lb25Db25maWcud2ViU29ja2V0Q29uc3RydWN0b3IgPSB3cztcblxuaWYgKCFwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgIFwiREFUQUJBU0VfVVJMIG11c3QgYmUgc2V0LiBEaWQgeW91IGZvcmdldCB0byBwcm92aXNpb24gYSBkYXRhYmFzZT9cIixcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IHBvb2wgPSBuZXcgUG9vbCh7IGNvbm5lY3Rpb25TdHJpbmc6IHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCB9KTtcbmV4cG9ydCBjb25zdCBkYiA9IGRyaXp6bGUoeyBjbGllbnQ6IHBvb2wsIHNjaGVtYSB9KTtcbiJdLCJuYW1lcyI6WyJQb29sIiwibmVvbkNvbmZpZyIsImRyaXp6bGUiLCJ3cyIsInNjaGVtYSIsIndlYlNvY2tldENvbnN0cnVjdG9yIiwicHJvY2VzcyIsImVudiIsIkRBVEFCQVNFX1VSTCIsIkVycm9yIiwicG9vbCIsImNvbm5lY3Rpb25TdHJpbmciLCJkYiIsImNsaWVudCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./server/db.ts\n");

/***/ }),

/***/ "(rsc)/./shared/schema.ts":
/*!**************************!*\
  !*** ./shared/schema.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   blogPosts: () => (/* binding */ blogPosts),\n/* harmony export */   contactMessages: () => (/* binding */ contactMessages),\n/* harmony export */   insertBlogPostSchema: () => (/* binding */ insertBlogPostSchema),\n/* harmony export */   insertContactMessageSchema: () => (/* binding */ insertContactMessageSchema),\n/* harmony export */   insertPageContentSchema: () => (/* binding */ insertPageContentSchema),\n/* harmony export */   insertProjectSchema: () => (/* binding */ insertProjectSchema),\n/* harmony export */   insertUserSchema: () => (/* binding */ insertUserSchema),\n/* harmony export */   insertWaitlistSchema: () => (/* binding */ insertWaitlistSchema),\n/* harmony export */   pageContents: () => (/* binding */ pageContents),\n/* harmony export */   projects: () => (/* binding */ projects),\n/* harmony export */   users: () => (/* binding */ users),\n/* harmony export */   waitlist: () => (/* binding */ waitlist)\n/* harmony export */ });\n/* harmony import */ var drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! drizzle-orm/pg-core */ \"(rsc)/./node_modules/drizzle-orm/pg-core/table.js\");\n/* harmony import */ var drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! drizzle-orm/pg-core */ \"(rsc)/./node_modules/drizzle-orm/pg-core/columns/serial.js\");\n/* harmony import */ var drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! drizzle-orm/pg-core */ \"(rsc)/./node_modules/drizzle-orm/pg-core/columns/text.js\");\n/* harmony import */ var drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! drizzle-orm/pg-core */ \"(rsc)/./node_modules/drizzle-orm/pg-core/columns/boolean.js\");\n/* harmony import */ var drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! drizzle-orm/pg-core */ \"(rsc)/./node_modules/drizzle-orm/pg-core/columns/timestamp.js\");\n/* harmony import */ var drizzle_zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! drizzle-zod */ \"(rsc)/./node_modules/drizzle-zod/index.mjs\");\n\n\n// User schema for admin access\nconst users = (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_1__.pgTable)(\"users\", {\n    id: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_2__.serial)(\"id\").primaryKey(),\n    username: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"username\").notNull().unique(),\n    password: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"password\").notNull()\n});\nconst insertUserSchema = (0,drizzle_zod__WEBPACK_IMPORTED_MODULE_0__.createInsertSchema)(users).pick({\n    username: true,\n    password: true\n});\n// Blog post schema\nconst blogPosts = (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_1__.pgTable)(\"blog_posts\", {\n    id: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_2__.serial)(\"id\").primaryKey(),\n    title: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"title\").notNull(),\n    slug: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"slug\").notNull().unique(),\n    excerpt: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"excerpt\").notNull(),\n    content: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"content\").notNull(),\n    imageUrl: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"image_url\").notNull(),\n    publishedAt: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"published_at\").notNull()\n});\nconst insertBlogPostSchema = (0,drizzle_zod__WEBPACK_IMPORTED_MODULE_0__.createInsertSchema)(blogPosts).omit({\n    id: true\n});\n// Project schema\nconst projects = (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_1__.pgTable)(\"projects\", {\n    id: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_2__.serial)(\"id\").primaryKey(),\n    title: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"title\").notNull(),\n    slug: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"slug\").notNull().unique(),\n    description: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"description\").notNull(),\n    content: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"content\").notNull(),\n    category: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"category\").notNull(),\n    imageUrl: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"image_url\").notNull(),\n    githubUrl: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"github_url\"),\n    demoUrl: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"demo_url\"),\n    isFeatured: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_4__.boolean)(\"is_featured\").default(false)\n});\nconst insertProjectSchema = (0,drizzle_zod__WEBPACK_IMPORTED_MODULE_0__.createInsertSchema)(projects).omit({\n    id: true\n});\n// Waitlist schema\nconst waitlist = (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_1__.pgTable)(\"waitlist\", {\n    id: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_2__.serial)(\"id\").primaryKey(),\n    email: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"email\").notNull().unique(),\n    submittedAt: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_5__.timestamp)(\"submitted_at\").defaultNow().notNull()\n});\nconst insertWaitlistSchema = (0,drizzle_zod__WEBPACK_IMPORTED_MODULE_0__.createInsertSchema)(waitlist).pick({\n    email: true\n});\n// Page content schema for static pages\nconst pageContents = (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_1__.pgTable)(\"page_contents\", {\n    id: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_2__.serial)(\"id\").primaryKey(),\n    page: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"page\").notNull().unique(),\n    content: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"content\").notNull(),\n    updatedAt: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_5__.timestamp)(\"updated_at\").defaultNow().notNull()\n});\nconst insertPageContentSchema = (0,drizzle_zod__WEBPACK_IMPORTED_MODULE_0__.createInsertSchema)(pageContents).omit({\n    id: true,\n    updatedAt: true\n});\n// Contact form submissions\nconst contactMessages = (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_1__.pgTable)(\"contact_messages\", {\n    id: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_2__.serial)(\"id\").primaryKey(),\n    name: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"name\").notNull(),\n    email: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"email\").notNull(),\n    subject: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"subject\").notNull(),\n    message: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_3__.text)(\"message\").notNull(),\n    submittedAt: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_5__.timestamp)(\"submitted_at\").defaultNow().notNull(),\n    read: (0,drizzle_orm_pg_core__WEBPACK_IMPORTED_MODULE_4__.boolean)(\"read\").default(false)\n});\nconst insertContactMessageSchema = (0,drizzle_zod__WEBPACK_IMPORTED_MODULE_0__.createInsertSchema)(contactMessages).omit({\n    id: true,\n    submittedAt: true,\n    read: true\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFBSSxDQUFDO0lBQzNFaEIsSUFBSTtJQUNKZ0MsV0FBVztBQUNiLEdBQUc7QUFFSCwyQkFBMkI7QUFDcEIsTUFBTUUsa0JBQWtCekMsNERBQU9BLENBQUMsb0JBQW9CO0lBQ3pETyxJQUFJTCwyREFBTUEsQ0FBQyxNQUFNTSxVQUFVO0lBQzNCa0MsTUFBTXpDLHlEQUFJQSxDQUFDLFFBQVFTLE9BQU87SUFDMUJ1QixPQUFPaEMseURBQUlBLENBQUMsU0FBU1MsT0FBTztJQUM1QmlDLFNBQVMxQyx5REFBSUEsQ0FBQyxXQUFXUyxPQUFPO0lBQ2hDa0MsU0FBUzNDLHlEQUFJQSxDQUFDLFdBQVdTLE9BQU87SUFDaEN3QixhQUFhOUIsOERBQVNBLENBQUMsZ0JBQWdCK0IsVUFBVSxHQUFHekIsT0FBTztJQUMzRG1DLE1BQU0xQyw0REFBT0EsQ0FBQyxRQUFRMkIsT0FBTyxDQUFDO0FBQ2hDLEdBQUc7QUFFSSxNQUFNZ0IsNkJBQTZCekMsK0RBQWtCQSxDQUFDb0MsaUJBQWlCbEIsSUFBSSxDQUFDO0lBQ2pGaEIsSUFBSTtJQUNKMkIsYUFBYTtJQUNiVyxNQUFNO0FBQ1IsR0FBRyIsInNvdXJjZXMiOlsiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9zaGFyZWQvc2NoZW1hLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHBnVGFibGUsIHRleHQsIHNlcmlhbCwgaW50ZWdlciwgYm9vbGVhbiwgdGltZXN0YW1wIH0gZnJvbSBcImRyaXp6bGUtb3JtL3BnLWNvcmVcIjtcbmltcG9ydCB7IGNyZWF0ZUluc2VydFNjaGVtYSB9IGZyb20gXCJkcml6emxlLXpvZFwiO1xuaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcblxuLy8gVXNlciBzY2hlbWEgZm9yIGFkbWluIGFjY2Vzc1xuZXhwb3J0IGNvbnN0IHVzZXJzID0gcGdUYWJsZShcInVzZXJzXCIsIHtcbiAgaWQ6IHNlcmlhbChcImlkXCIpLnByaW1hcnlLZXkoKSxcbiAgdXNlcm5hbWU6IHRleHQoXCJ1c2VybmFtZVwiKS5ub3ROdWxsKCkudW5pcXVlKCksXG4gIHBhc3N3b3JkOiB0ZXh0KFwicGFzc3dvcmRcIikubm90TnVsbCgpLFxufSk7XG5cbmV4cG9ydCBjb25zdCBpbnNlcnRVc2VyU2NoZW1hID0gY3JlYXRlSW5zZXJ0U2NoZW1hKHVzZXJzKS5waWNrKHtcbiAgdXNlcm5hbWU6IHRydWUsXG4gIHBhc3N3b3JkOiB0cnVlLFxufSk7XG5cbi8vIEJsb2cgcG9zdCBzY2hlbWFcbmV4cG9ydCBjb25zdCBibG9nUG9zdHMgPSBwZ1RhYmxlKFwiYmxvZ19wb3N0c1wiLCB7XG4gIGlkOiBzZXJpYWwoXCJpZFwiKS5wcmltYXJ5S2V5KCksXG4gIHRpdGxlOiB0ZXh0KFwidGl0bGVcIikubm90TnVsbCgpLFxuICBzbHVnOiB0ZXh0KFwic2x1Z1wiKS5ub3ROdWxsKCkudW5pcXVlKCksXG4gIGV4Y2VycHQ6IHRleHQoXCJleGNlcnB0XCIpLm5vdE51bGwoKSxcbiAgY29udGVudDogdGV4dChcImNvbnRlbnRcIikubm90TnVsbCgpLFxuICBpbWFnZVVybDogdGV4dChcImltYWdlX3VybFwiKS5ub3ROdWxsKCksXG4gIHB1Ymxpc2hlZEF0OiB0ZXh0KFwicHVibGlzaGVkX2F0XCIpLm5vdE51bGwoKSwgLy8gQ2hhbmdlIHRvIHRleHQgdG8gYXZvaWQgRGF0ZSBpc3N1ZXNcbn0pO1xuXG5leHBvcnQgY29uc3QgaW5zZXJ0QmxvZ1Bvc3RTY2hlbWEgPSBjcmVhdGVJbnNlcnRTY2hlbWEoYmxvZ1Bvc3RzKVxuICAub21pdCh7XG4gICAgaWQ6IHRydWUsXG4gIH0pO1xuXG4vLyBQcm9qZWN0IHNjaGVtYVxuZXhwb3J0IGNvbnN0IHByb2plY3RzID0gcGdUYWJsZShcInByb2plY3RzXCIsIHtcbiAgaWQ6IHNlcmlhbChcImlkXCIpLnByaW1hcnlLZXkoKSxcbiAgdGl0bGU6IHRleHQoXCJ0aXRsZVwiKS5ub3ROdWxsKCksXG4gIHNsdWc6IHRleHQoXCJzbHVnXCIpLm5vdE51bGwoKS51bmlxdWUoKSxcbiAgZGVzY3JpcHRpb246IHRleHQoXCJkZXNjcmlwdGlvblwiKS5ub3ROdWxsKCksXG4gIGNvbnRlbnQ6IHRleHQoXCJjb250ZW50XCIpLm5vdE51bGwoKSxcbiAgY2F0ZWdvcnk6IHRleHQoXCJjYXRlZ29yeVwiKS5ub3ROdWxsKCksXG4gIGltYWdlVXJsOiB0ZXh0KFwiaW1hZ2VfdXJsXCIpLm5vdE51bGwoKSxcbiAgZ2l0aHViVXJsOiB0ZXh0KFwiZ2l0aHViX3VybFwiKSxcbiAgZGVtb1VybDogdGV4dChcImRlbW9fdXJsXCIpLFxuICBpc0ZlYXR1cmVkOiBib29sZWFuKFwiaXNfZmVhdHVyZWRcIikuZGVmYXVsdChmYWxzZSksXG59KTtcblxuZXhwb3J0IGNvbnN0IGluc2VydFByb2plY3RTY2hlbWEgPSBjcmVhdGVJbnNlcnRTY2hlbWEocHJvamVjdHMpLm9taXQoe1xuICBpZDogdHJ1ZSxcbn0pO1xuXG4vLyBXYWl0bGlzdCBzY2hlbWFcbmV4cG9ydCBjb25zdCB3YWl0bGlzdCA9IHBnVGFibGUoXCJ3YWl0bGlzdFwiLCB7XG4gIGlkOiBzZXJpYWwoXCJpZFwiKS5wcmltYXJ5S2V5KCksXG4gIGVtYWlsOiB0ZXh0KFwiZW1haWxcIikubm90TnVsbCgpLnVuaXF1ZSgpLFxuICBzdWJtaXR0ZWRBdDogdGltZXN0YW1wKFwic3VibWl0dGVkX2F0XCIpLmRlZmF1bHROb3coKS5ub3ROdWxsKCksXG59KTtcblxuZXhwb3J0IGNvbnN0IGluc2VydFdhaXRsaXN0U2NoZW1hID0gY3JlYXRlSW5zZXJ0U2NoZW1hKHdhaXRsaXN0KS5waWNrKHtcbiAgZW1haWw6IHRydWUsXG59KTtcblxuLy8gUGFnZSBjb250ZW50IHNjaGVtYSBmb3Igc3RhdGljIHBhZ2VzXG5leHBvcnQgY29uc3QgcGFnZUNvbnRlbnRzID0gcGdUYWJsZShcInBhZ2VfY29udGVudHNcIiwge1xuICBpZDogc2VyaWFsKFwiaWRcIikucHJpbWFyeUtleSgpLFxuICBwYWdlOiB0ZXh0KFwicGFnZVwiKS5ub3ROdWxsKCkudW5pcXVlKCksIC8vIGhvbWUsIGFib3V0LCBsZWdhbCwgY29udGFjdFxuICBjb250ZW50OiB0ZXh0KFwiY29udGVudFwiKS5ub3ROdWxsKCksIC8vIEpTT04gc3RyaW5naWZpZWQgY29udGVudFxuICB1cGRhdGVkQXQ6IHRpbWVzdGFtcChcInVwZGF0ZWRfYXRcIikuZGVmYXVsdE5vdygpLm5vdE51bGwoKVxufSk7XG5cbmV4cG9ydCBjb25zdCBpbnNlcnRQYWdlQ29udGVudFNjaGVtYSA9IGNyZWF0ZUluc2VydFNjaGVtYShwYWdlQ29udGVudHMpLm9taXQoe1xuICBpZDogdHJ1ZSxcbiAgdXBkYXRlZEF0OiB0cnVlXG59KTtcblxuLy8gQ29udGFjdCBmb3JtIHN1Ym1pc3Npb25zXG5leHBvcnQgY29uc3QgY29udGFjdE1lc3NhZ2VzID0gcGdUYWJsZShcImNvbnRhY3RfbWVzc2FnZXNcIiwge1xuICBpZDogc2VyaWFsKFwiaWRcIikucHJpbWFyeUtleSgpLFxuICBuYW1lOiB0ZXh0KFwibmFtZVwiKS5ub3ROdWxsKCksXG4gIGVtYWlsOiB0ZXh0KFwiZW1haWxcIikubm90TnVsbCgpLFxuICBzdWJqZWN0OiB0ZXh0KFwic3ViamVjdFwiKS5ub3ROdWxsKCksXG4gIG1lc3NhZ2U6IHRleHQoXCJtZXNzYWdlXCIpLm5vdE51bGwoKSxcbiAgc3VibWl0dGVkQXQ6IHRpbWVzdGFtcChcInN1Ym1pdHRlZF9hdFwiKS5kZWZhdWx0Tm93KCkubm90TnVsbCgpLFxuICByZWFkOiBib29sZWFuKFwicmVhZFwiKS5kZWZhdWx0KGZhbHNlKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgaW5zZXJ0Q29udGFjdE1lc3NhZ2VTY2hlbWEgPSBjcmVhdGVJbnNlcnRTY2hlbWEoY29udGFjdE1lc3NhZ2VzKS5vbWl0KHtcbiAgaWQ6IHRydWUsXG4gIHN1Ym1pdHRlZEF0OiB0cnVlLFxuICByZWFkOiB0cnVlXG59KTtcblxuLy8gVHlwZSBleHBvcnRzIGZvciBUeXBlU2NyaXB0XG5leHBvcnQgdHlwZSBVc2VyID0gdHlwZW9mIHVzZXJzLiRpbmZlclNlbGVjdDtcbmV4cG9ydCB0eXBlIEluc2VydFVzZXIgPSB6LmluZmVyPHR5cGVvZiBpbnNlcnRVc2VyU2NoZW1hPjtcblxuZXhwb3J0IHR5cGUgQmxvZ1Bvc3QgPSB0eXBlb2YgYmxvZ1Bvc3RzLiRpbmZlclNlbGVjdDtcbmV4cG9ydCB0eXBlIEluc2VydEJsb2dQb3N0ID0gei5pbmZlcjx0eXBlb2YgaW5zZXJ0QmxvZ1Bvc3RTY2hlbWE+O1xuXG5leHBvcnQgdHlwZSBQcm9qZWN0ID0gdHlwZW9mIHByb2plY3RzLiRpbmZlclNlbGVjdDtcbmV4cG9ydCB0eXBlIEluc2VydFByb2plY3QgPSB6LmluZmVyPHR5cGVvZiBpbnNlcnRQcm9qZWN0U2NoZW1hPjtcblxuZXhwb3J0IHR5cGUgV2FpdGxpc3RFbnRyeSA9IHR5cGVvZiB3YWl0bGlzdC4kaW5mZXJTZWxlY3Q7XG5leHBvcnQgdHlwZSBJbnNlcnRXYWl0bGlzdEVudHJ5ID0gei5pbmZlcjx0eXBlb2YgaW5zZXJ0V2FpdGxpc3RTY2hlbWE+O1xuXG5leHBvcnQgdHlwZSBQYWdlQ29udGVudCA9IHR5cGVvZiBwYWdlQ29udGVudHMuJGluZmVyU2VsZWN0O1xuZXhwb3J0IHR5cGUgSW5zZXJ0UGFnZUNvbnRlbnQgPSB6LmluZmVyPHR5cGVvZiBpbnNlcnRQYWdlQ29udGVudFNjaGVtYT47XG5cbmV4cG9ydCB0eXBlIENvbnRhY3RNZXNzYWdlID0gdHlwZW9mIGNvbnRhY3RNZXNzYWdlcy4kaW5mZXJTZWxlY3Q7XG5leHBvcnQgdHlwZSBJbnNlcnRDb250YWN0TWVzc2FnZSA9IHouaW5mZXI8dHlwZW9mIGluc2VydENvbnRhY3RNZXNzYWdlU2NoZW1hPjtcbiJdLCJuYW1lcyI6WyJwZ1RhYmxlIiwidGV4dCIsInNlcmlhbCIsImJvb2xlYW4iLCJ0aW1lc3RhbXAiLCJjcmVhdGVJbnNlcnRTY2hlbWEiLCJ1c2VycyIsImlkIiwicHJpbWFyeUtleSIsInVzZXJuYW1lIiwibm90TnVsbCIsInVuaXF1ZSIsInBhc3N3b3JkIiwiaW5zZXJ0VXNlclNjaGVtYSIsInBpY2siLCJibG9nUG9zdHMiLCJ0aXRsZSIsInNsdWciLCJleGNlcnB0IiwiY29udGVudCIsImltYWdlVXJsIiwicHVibGlzaGVkQXQiLCJpbnNlcnRCbG9nUG9zdFNjaGVtYSIsIm9taXQiLCJwcm9qZWN0cyIsImRlc2NyaXB0aW9uIiwiY2F0ZWdvcnkiLCJnaXRodWJVcmwiLCJkZW1vVXJsIiwiaXNGZWF0dXJlZCIsImRlZmF1bHQiLCJpbnNlcnRQcm9qZWN0U2NoZW1hIiwid2FpdGxpc3QiLCJlbWFpbCIsInN1Ym1pdHRlZEF0IiwiZGVmYXVsdE5vdyIsImluc2VydFdhaXRsaXN0U2NoZW1hIiwicGFnZUNvbnRlbnRzIiwicGFnZSIsInVwZGF0ZWRBdCIsImluc2VydFBhZ2VDb250ZW50U2NoZW1hIiwiY29udGFjdE1lc3NhZ2VzIiwibmFtZSIsInN1YmplY3QiLCJtZXNzYWdlIiwicmVhZCIsImluc2VydENvbnRhY3RNZXNzYWdlU2NoZW1hIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./shared/schema.ts\n");

/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "?66e9":
/*!********************************!*\
  !*** utf-8-validate (ignored) ***!
  \********************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/drizzle-orm","vendor-chunks/zod","vendor-chunks/@neondatabase","vendor-chunks/ws","vendor-chunks/drizzle-zod","vendor-chunks/node-gyp-build","vendor-chunks/bufferutil"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute&page=%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpage-contents%2F%5Bpage%5D%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();