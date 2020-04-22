using System;
using System.Collections.Generic;
using System.Text;
using Xunit;
using Xunit.Abstractions;

namespace Routine.Api.Test
{
    [Collection("ProgramInitCollection")]
    public class BaseTest
    {
        public IServiceProvider Provider { get; }


        public BaseTest(ProgramInitFixture programInitFixture)
        {
            Provider = programInitFixture.Provider;
        }
    }
}
