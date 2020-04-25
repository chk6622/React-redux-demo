using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit.Abstractions;

namespace SalesManagementApiTest
{
    public class TestOrder : Xunit.Sdk.ITestCaseOrderer
    {
        public IEnumerable<TTestCase> OrderTestCases<TTestCase>(IEnumerable<TTestCase> testCases) where TTestCase : ITestCase
        {

            testCases = testCases.OrderBy(o => o.DisplayName);
            return testCases;
        }
    }
}
