﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Onboarding_Task.ViewModels
{
    public class QueryResultView<T>
    {
        public List<T> Results { set; get; }
        public int TotalData { set; get; }
    }
}
