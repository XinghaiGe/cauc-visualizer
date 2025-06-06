
// 定义全局变量
const algorithms = [
    { id: 'selectionSort', name: '选择排序' },
    { id: 'bubbleSort', name: '冒泡排序' },
    { id: 'insertionSort', name: '插入排序' },
    { id: 'mergeSort', name: '归并排序' },
    { id: 'quickSort', name: '快速排序' },
    { id: 'heapSort', name: '堆排序' },
    { id: 'shellSort', name: '希尔排序' },
    { id: 'countingSort', name: '计数排序' },
    { id: 'radixSort', name: '基数排序' }
];

// 颜色定义
const BAR_COLOR_DEFAULT = '#a0aec0'; // 默认灰色
const BAR_COLOR_COMPARING = '#fcd34d'; // 黄色
const BAR_COLOR_SWAPPING = '#f97316'; // 橙色
const BAR_COLOR_PIVOT = '#dc2626'; // 红色 (快速排序基准)
const BAR_COLOR_SORTED = '#34d399'; // 绿色 (已排序元素)

// 获取DOM元素
const gridContainer = document.getElementById('grid-container');
const startAllButton = document.getElementById('start-all-button');
const stopAllButton = document.getElementById('stop-all-button');
const intervalTimeInput = document.getElementById('interval-time');

// 存储所有算法的状态
let algorithmStates = [];
let globalAnimationInterval = null;

// 初始化页面
function initialize() {
    // 清空容器
    gridContainer.innerHTML = '';
    algorithmStates = [];

    // 从localStorage获取间隔时间
    const savedIntervalTime = localStorage.getItem('intervalTime');
    if (savedIntervalTime) {
        intervalTimeInput.value = savedIntervalTime;
    }

    // 创建算法卡片
    algorithms.forEach(algorithm => {
        const card = document.createElement('div');
        card.className = 'algorithm-card';
        card.innerHTML = `
                    <div class="algorithm-name">${algorithm.name}</div>
                    <div class="chart-container" id="chart-${algorithm.id}"></div>
                    <div class="step-info">
                        <span id="current-step-${algorithm.id}">0</span> / 
                        <span id="total-steps-${algorithm.id}">0</span>
                    </div>
                `;
        gridContainer.appendChild(card);

        // 初始化算法状态
        algorithmStates[algorithm.id] = {
            steps: [],
            currentStepIndex: 0,
            chart: null,
            animationInterval: null,
            initialArray: [9, 2, 7, 5, 1, 8, 3, 10, 4, 6]
        };

        // 初始化算法步骤
        initializeAlgorithm(algorithm.id);
    });
}

// 初始化算法步骤
function initializeAlgorithm(algorithmId) {
    const state = algorithmStates[algorithmId];
    state.steps = [];
    state.currentStepIndex = 0;

    const arrayCopy = [...state.initialArray];

    // 根据算法ID调用对应的排序算法
    switch (algorithmId) {
        case 'selectionSort':
            selectionSortAlgorithm(arrayCopy, algorithmId);
            break;
        case 'bubbleSort':
            bubbleSortAlgorithm(arrayCopy, algorithmId);
            break;
        case 'insertionSort':
            insertionSortAlgorithm(arrayCopy, algorithmId);
            break;
        case 'mergeSort':
            mergeSortAlgorithm(arrayCopy, algorithmId);
            break;
        case 'quickSort':
            quickSortAlgorithm(arrayCopy, 0, arrayCopy.length - 1, algorithmId);
            break;
        case 'heapSort':
            heapSortAlgorithm(arrayCopy, algorithmId);
            break;
        case 'shellSort':
            shellSortAlgorithm(arrayCopy, algorithmId);
            break;
        case 'countingSort':
            countingSortAlgorithm(arrayCopy, algorithmId);
            break;
        case 'radixSort':
            radixSortAlgorithm(arrayCopy, algorithmId);
            break;
    }

    // 更新总步骤数
    document.getElementById(`total-steps-${algorithmId}`).textContent = state.steps.length;

    // 更新可视化
    updateVisualization(algorithmId);
}

// 记录算法步骤的通用函数
function recordStep(algorithmId, currentArray, description, barColors = []) {
    algorithmStates[algorithmId].steps.push({
        array: [...currentArray],
        description: description,
        barColors: barColors.length > 0 ? [...barColors] : Array(currentArray.length).fill(BAR_COLOR_DEFAULT)
    });
}

// 以下是各个排序算法的实现（与index.js中类似，但增加了algorithmId参数）
function selectionSortAlgorithm(arr, algorithmId) {
    const n = arr.length;
    recordStep(algorithmId, arr, "开始选择排序", Array(n).fill(BAR_COLOR_DEFAULT));

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        recordStep(algorithmId, arr, `寻找第 ${i + 1} 轮最小元素`,
            Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === minIndex ? BAR_COLOR_COMPARING : c));

        for (let j = i + 1; j < n; j++) {
            recordStep(algorithmId, arr, `比较 ${arr[j]} 和 ${arr[minIndex]}`,
                Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j || idx === minIndex) ? BAR_COLOR_COMPARING : c));

            if (arr[j] < arr[minIndex]) {
                minIndex = j;
                recordStep(algorithmId, arr, `更新最小索引为 ${minIndex}`,
                    Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === minIndex ? BAR_COLOR_COMPARING : c));
            }
        }

        recordStep(algorithmId, arr, `交换 ${arr[i]} 和 ${arr[minIndex]}`,
            Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === i || idx === minIndex) ? BAR_COLOR_SWAPPING : c));

        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

        recordStep(algorithmId, arr, `交换完成，元素 ${arr[i]} 已排序`,
            Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx <= i ? BAR_COLOR_SORTED : c));
    }

    recordStep(algorithmId, arr, "选择排序完成", Array(n).fill(BAR_COLOR_SORTED));
}

// 冒泡排序算法实现
function bubbleSortAlgorithm(arr, algorithmId) {
    const n = arr.length;
    recordStep(algorithmId, arr, "开始冒泡排序", Array(n).fill(BAR_COLOR_DEFAULT));

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            recordStep(algorithmId, arr, `比较 ${arr[j]} 和 ${arr[j + 1]}`,
                Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j || idx === j + 1) ? BAR_COLOR_COMPARING : c));

            if (arr[j] > arr[j + 1]) {
                recordStep(algorithmId, arr, `交换 ${arr[j]} 和 ${arr[j + 1]}`,
                    Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j || idx === j + 1) ? BAR_COLOR_SWAPPING : c));

                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                recordStep(algorithmId, arr, `交换完成`,
                    Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j || idx === j + 1) ? BAR_COLOR_SWAPPING : c));
            }
        }
        recordStep(algorithmId, arr, `第 ${i + 1} 轮冒泡完成，最大元素已移到末尾`,
            Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx >= n - i - 1 ? BAR_COLOR_SORTED : c));
    }
    recordStep(algorithmId, arr, "冒泡排序完成", Array(n).fill(BAR_COLOR_SORTED));
}

// 插入排序算法实现
function insertionSortAlgorithm(arr, algorithmId) {
    const n = arr.length;
    recordStep(algorithmId, arr, "开始插入排序", Array(n).fill(BAR_COLOR_DEFAULT));

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        recordStep(algorithmId, arr, `将元素 ${key} (索引 ${i}) 插入到已排序部分`,
            Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === i ? BAR_COLOR_COMPARING : c));

        while (j >= 0 && arr[j] > key) {
            recordStep(algorithmId, arr, `比较 ${arr[j]} 和 ${key}`,
                Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j || idx === i) ? BAR_COLOR_COMPARING : c));

            arr[j + 1] = arr[j];

            recordStep(algorithmId, arr, `元素 ${arr[j]} (索引 ${j}) 后移到索引 ${j + 1}`,
                Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === j + 1 ? BAR_COLOR_SWAPPING : c));

            j--;
        }

        arr[j + 1] = key;
        recordStep(algorithmId, arr, `将 ${key} 插入到索引 ${j + 1}`,
            Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === j + 1 ? BAR_COLOR_SWAPPING : c));
    }
    recordStep(algorithmId, arr, "插入排序完成", Array(n).fill(BAR_COLOR_SORTED));
}

// 归并排序算法实现
function mergeSortAlgorithm(arr, algorithmId) {
    if (arr.length > 1) {
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);

        recordStep(algorithmId, arr, `分割数组为左子数组 [${left}] 和右子数组 [${right}]`,
            Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx < mid ? BAR_COLOR_COMPARING : BAR_COLOR_DEFAULT));

        mergeSortAlgorithm(left, algorithmId);
        mergeSortAlgorithm(right, algorithmId);

        let i = 0, j = 0, k = 0;
        recordStep(algorithmId, arr, "合并左子数组和右子数组",
            Array(arr.length).fill(BAR_COLOR_DEFAULT));

        while (i < left.length && j < right.length) {
            recordStep(algorithmId, arr, `比较 ${left[i]} 和 ${right[j]}`,
                Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === k ? BAR_COLOR_COMPARING : c));

            if (left[i] < right[j]) {
                arr[k] = left[i];
                i++;
                recordStep(algorithmId, arr, `${left[i - 1]} 较小，放入数组`,
                    Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === k ? BAR_COLOR_SWAPPING : c));
            } else {
                arr[k] = right[j];
                j++;
                recordStep(algorithmId, arr, `${right[j - 1]} 较小，放入数组`,
                    Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === k ? BAR_COLOR_SWAPPING : c));
            }
            k++;
        }

        while (i < left.length) {
            arr[k] = left[i];
            i++;
            k++;
            recordStep(algorithmId, arr, `将剩余左子数组元素 ${left[i - 1]} 放入数组`,
                Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === k - 1 ? BAR_COLOR_SWAPPING : c));
        }

        while (j < right.length) {
            arr[k] = right[j];
            j++;
            k++;
            recordStep(algorithmId, arr, `将剩余右子数组元素 ${right[j - 1]} 放入数组`,
                Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === k - 1 ? BAR_COLOR_SWAPPING : c));
        }
    }
    if (arr.length === 1) {
        recordStep(algorithmId, arr, `单个元素 ${arr[0]} 视为已排序`,
            Array(arr.length).fill(BAR_COLOR_SORTED));
    } else if (arr.length > 1) {
        recordStep(algorithmId, arr, `数组 [${arr}] 合并完成`,
            Array(arr.length).fill(BAR_COLOR_DEFAULT));
    }
    // fix
    
    // if (arr.length === initialArray.length && isSorted(arr)) {
    //     recordStep(algorithmId, arr, "归并排序完成",
    //         Array(arr.length).fill(BAR_COLOR_SORTED));
    // }
}

// 快速排序算法实现
function quickSortAlgorithm(arr, low, high, algorithmId, initialColors = []) {
    if (low === undefined) low = 0;
    if (high === undefined) high = arr.length - 1;

    if (initialColors.length === 0) {
        recordStep(algorithmId, arr, "开始快速排序",
            Array(arr.length).fill(BAR_COLOR_DEFAULT));
    }

    if (low < high) {
        recordStep(algorithmId, arr, `对子数组 [${low}, ${high}] 进行分区`,
            initialColors.length > 0 ? initialColors : Array(arr.length).fill(BAR_COLOR_DEFAULT));

        let pi = partition(arr, low, high, algorithmId, initialColors);

        let currentColors = algorithmStates[algorithmId].steps[algorithmStates[algorithmId].steps.length - 1].barColors;
        recordStep(algorithmId, arr, `基准元素 ${arr[pi]} 位于正确位置 (索引 ${pi})`,
            currentColors.map((c, idx) => idx === pi ? BAR_COLOR_SORTED : c));

        quickSortAlgorithm(arr, low, pi - 1, algorithmId, currentColors);
        quickSortAlgorithm(arr, pi + 1, high, algorithmId, currentColors);
    } else if (low === high) {
        let currentColors = algorithmStates[algorithmId].steps.length > 0 ?
            algorithmStates[algorithmId].steps[algorithmStates[algorithmId].steps.length - 1].barColors :
            Array(arr.length).fill(BAR_COLOR_DEFAULT);
        recordStep(algorithmId, arr, `元素 ${arr[low]} (索引 ${low}) 视为已排序`,
            currentColors.map((c, idx) => idx === low ? BAR_COLOR_SORTED : c));
    }

    if (low === 0 && high === arr.length - 1 && arr.every((_, i) =>
        algorithmStates[algorithmId].steps[algorithmStates[algorithmId].steps.length - 1].barColors[i] === BAR_COLOR_SORTED)) {
        recordStep(algorithmId, arr, "快速排序完成",
            Array(arr.length).fill(BAR_COLOR_SORTED));
    }
}

// 快速排序分区函数
function partition(arr, low, high, algorithmId, initialColors) {
    let pivot = arr[high];
    let i = (low - 1);

    let colors = initialColors.length > 0 ? [...initialColors] : Array(arr.length).fill(BAR_COLOR_DEFAULT);
    colors[high] = BAR_COLOR_PIVOT;
    recordStep(algorithmId, arr, `选择 ${pivot} (索引 ${high}) 作为基准`, colors);

    for (let j = low; j < high; j++) {
        colors = initialColors.length > 0 ? [...initialColors] : Array(arr.length).fill(BAR_COLOR_DEFAULT);
        colors[high] = BAR_COLOR_PIVOT;
        colors[j] = BAR_COLOR_COMPARING;
        if (i >= low) colors[i] = BAR_COLOR_COMPARING;

        recordStep(algorithmId, arr, `比较元素 ${arr[j]} (索引 ${j}) 和基准 ${pivot}`, colors);

        if (arr[j] <= pivot) {
            i++;
            colors[i] = BAR_COLOR_SWAPPING;
            colors[j] = BAR_COLOR_SWAPPING;
            recordStep(algorithmId, arr, `元素 ${arr[j]} 小于或等于基准，交换 ${arr[i]} 和 ${arr[j]}`, colors);
            [arr[i], arr[j]] = [arr[j], arr[i]];
            recordStep(algorithmId, arr, `交换完成`, colors);
        }
    }

    colors = initialColors.length > 0 ? [...initialColors] : Array(arr.length).fill(BAR_COLOR_DEFAULT);
    colors[high] = BAR_COLOR_SWAPPING;
    colors[i + 1] = BAR_COLOR_SWAPPING;
    recordStep(algorithmId, arr, `将基准 ${pivot} 交换到正确位置 (索引 ${i + 1})`, colors);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    recordStep(algorithmId, arr, `基准放置完成`, colors);

    return i + 1;
}

// 堆排序算法实现
function heapSortAlgorithm(arr, algorithmId) {
    let n = arr.length;
    recordStep(algorithmId, arr, "开始堆排序", Array(n).fill(BAR_COLOR_DEFAULT));

    // 构建最大堆
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        recordStep(algorithmId, arr, `构建堆: 对子树 ${i} 进行堆化`,
            Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === i ? BAR_COLOR_COMPARING : c));
        heapify(arr, n, i, algorithmId);
    }
    recordStep(algorithmId, arr, "最大堆构建完成", Array(n).fill(BAR_COLOR_DEFAULT));

    // 一个个地从堆顶取出元素
    for (let i = n - 1; i > 0; i--) {
        recordStep(algorithmId, arr, `将堆顶元素 ${arr[0]} 与末尾元素 ${arr[i]} 交换`,
            Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === 0 || idx === i) ? BAR_COLOR_SWAPPING : c));

        [arr[0], arr[i]] = [arr[i], arr[0]];

        recordStep(algorithmId, arr, `交换完成，元素 ${arr[i]} 已排序`,
            Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx > i ? BAR_COLOR_SORTED : (idx === i ? BAR_COLOR_SORTED : c)));

        recordStep(algorithmId, arr, `对剩余 ${i} 个元素的堆进行堆化`,
            Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx > i ? BAR_COLOR_SORTED : c));

        heapify(arr, i, 0, algorithmId);
    }
    recordStep(algorithmId, arr, "堆排序完成", Array(n).fill(BAR_COLOR_SORTED));
}

// 堆化函数
function heapify(arr, n, i, algorithmId) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    let colors = Array(arr.length).fill(BAR_COLOR_DEFAULT);
    for (let k = n; k < arr.length; k++) colors[k] = BAR_COLOR_SORTED;

    recordStep(algorithmId, arr, `堆化: 根节点 ${arr[i]} (索引 ${i})`,
        colors.map((c, idx) => idx === i ? BAR_COLOR_COMPARING : c));

    if (left < n) {
        recordStep(algorithmId, arr, `堆化: 比较根节点 ${arr[largest]} 和左子节点 ${arr[left]}`,
            colors.map((c, idx) => (idx === largest || idx === left) ? BAR_COLOR_COMPARING : c));

        if (arr[left] > arr[largest]) {
            largest = left;
            recordStep(algorithmId, arr, `堆化: 左子节点 ${arr[left]} 更大`,
                colors.map((c, idx) => idx === largest ? BAR_COLOR_COMPARING : c));
        }
    }

    if (right < n) {
        recordStep(algorithmId, arr, `堆化: 比较当前最大 ${arr[largest]} 和右子节点 ${arr[right]}`,
            colors.map((c, idx) => (idx === largest || idx === right) ? BAR_COLOR_COMPARING : c));

        if (arr[right] > arr[largest]) {
            largest = right;
            recordStep(algorithmId, arr, `堆化: 右子节点 ${arr[right]} 更大`,
                colors.map((c, idx) => idx === largest ? BAR_COLOR_COMPARING : c));
        }
    }

    if (largest !== i) {
        recordStep(algorithmId, arr, `堆化: 交换 ${arr[i]} 和 ${arr[largest]}`,
            colors.map((c, idx) => (idx === i || idx === largest) ? BAR_COLOR_SWAPPING : c));

        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        recordStep(algorithmId, arr, `堆化: 交换完成`,
            colors.map((c, idx) => (idx === i || idx === largest) ? BAR_COLOR_SWAPPING : c));

        heapify(arr, n, largest, algorithmId);
    }
}

// 希尔排序算法实现
function shellSortAlgorithm(arr, algorithmId) {
    let n = arr.length;
    recordStep(algorithmId, arr, "开始希尔排序", Array(n).fill(BAR_COLOR_DEFAULT));

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        recordStep(algorithmId, arr, `当前增量: ${gap}`, Array(n).fill(BAR_COLOR_DEFAULT));

        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j;

            recordStep(algorithmId, arr, `将元素 ${temp} (索引 ${i}) 插入到增量为 ${gap} 的子序列中`,
                Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === i ? BAR_COLOR_COMPARING : c));

            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                recordStep(algorithmId, arr, `比较 ${arr[j - gap]} 和 ${temp}`,
                    Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => (idx === j - gap || idx === i) ? BAR_COLOR_COMPARING : c));

                arr[j] = arr[j - gap];

                recordStep(algorithmId, arr, `元素 ${arr[j]} (索引 ${j - gap}) 后移到索引 ${j}`,
                    Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === j ? BAR_COLOR_SWAPPING : c));
            }

            arr[j] = temp;
            recordStep(algorithmId, arr, `将 ${temp} 插入到索引 ${j}`,
                Array(n).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === j ? BAR_COLOR_SWAPPING : c));
        }
    }
    recordStep(algorithmId, arr, "希尔排序完成", Array(n).fill(BAR_COLOR_SORTED));
}

// 计数排序算法实现
function countingSortAlgorithm(arr, algorithmId) {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const countArray = new Array(range).fill(0);

    recordStep(algorithmId, arr, "开始计数排序", Array(arr.length).fill(BAR_COLOR_DEFAULT));
    recordStep(algorithmId, arr, `创建计数数组，范围 [${min}, ${max}]`, Array(arr.length).fill(BAR_COLOR_DEFAULT));

    for (let num of arr) {
        recordStep(algorithmId, arr, `统计 ${num} 的出现次数`,
            Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === arr.indexOf(num) ? BAR_COLOR_COMPARING : c));

        countArray[num - min]++;
    }

    let index = 0;
    for (let i = 0; i < range; i++) {
        while (countArray[i] > 0) {
            recordStep(algorithmId, arr, `将 ${i + min} 放回原数组`,
                Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === index ? BAR_COLOR_SWAPPING : c));

            arr[index++] = i + min;
            countArray[i]--;
        }
    }
    recordStep(algorithmId, arr, "计数排序完成", Array(arr.length).fill(BAR_COLOR_SORTED));
}

// 基数排序算法实现
function radixSortAlgorithm(arr, algorithmId) {
    const getDigit = (num, pos) => Math.floor(Math.abs(num) / Math.pow(10, pos)) % 10;
    const maxDigit = Math.max(...arr).toString().length;

    recordStep(algorithmId, arr, "开始基数排序", Array(arr.length).fill(BAR_COLOR_DEFAULT));
    recordStep(algorithmId, arr, `最大位数: ${maxDigit}`, Array(arr.length).fill(BAR_COLOR_DEFAULT));

    for (let pos = 0; pos < maxDigit; pos++) {
        const buckets = Array.from({ length: 10 }, () => []);
        recordStep(algorithmId, arr, `按第 ${pos} 位数字分配到桶`, Array(arr.length).fill(BAR_COLOR_DEFAULT));

        for (let num of arr) {
            const digit = getDigit(num, pos);
            recordStep(algorithmId, arr, `数字 ${num} 的第 ${pos} 位: ${digit}`,
                Array(arr.length).fill(BAR_COLOR_DEFAULT).map((c, idx) => idx === arr.indexOf(num) ? BAR_COLOR_COMPARING : c));

            buckets[digit].push(num);
        }

        recordStep(algorithmId, arr, `收集桶中的元素`, Array(arr.length).fill(BAR_COLOR_DEFAULT));
        arr = [].concat(...buckets);
    }
    recordStep(algorithmId, arr, "基数排序完成", Array(arr.length).fill(BAR_COLOR_SORTED));
}

// 更新单个算法的可视化
function updateVisualization(algorithmId) {
    const state = algorithmStates[algorithmId];
    const steps = state.steps;

    if (steps.length === 0) {
        document.getElementById(`current-step-${algorithmId}`).textContent = 0;
        return;
    }

    const currentStepData = steps[state.currentStepIndex];

    // 更新步骤信息
    document.getElementById(`current-step-${algorithmId}`).textContent = state.currentStepIndex + 1;

    // 更新图表
    renderChart(algorithmId, currentStepData.array, currentStepData.barColors);
}

// 渲染图表
function renderChart(algorithmId, dataArray, barColors) {
    const chartData = dataArray.map((value, index) => ({
        y: value,
        label: value.toString(),
        color: barColors[index] || BAR_COLOR_DEFAULT
    }));

    const state = algorithmStates[algorithmId];

    if (state.chart) {
        // 更新现有图表
        state.chart.options.data[0].dataPoints = chartData;
        state.chart.render();
    } else {
        // 创建新图表
        state.chart = new CanvasJS.Chart(`chart-${algorithmId}`, {
            animationEnabled: false,
            theme: "light2",
            axisY: {
                includeZero: true,
                maximum: 10,
                interval: 1
            },
            data: [{
                type: "column",
                dataPoints: chartData,
                indexLabel: "{y}",
                indexLabelFontColor: "#333",
                indexLabelPlacement: "outside"
            }]
        });
        state.chart.render();
    }
}

// 开始所有算法的动画
function startAllAnimations() {
    stopAllAnimations(); // 先停止所有正在运行的动画

    const intervalTime = parseInt(intervalTimeInput.value);

    globalAnimationInterval = setInterval(() => {
        let allFinished = true;

        // 更新所有算法的步骤
        algorithms.forEach(algorithm => {
            const state = algorithmStates[algorithm.id];

            if (state.currentStepIndex < state.steps.length - 1) {
                state.currentStepIndex++;
                updateVisualization(algorithm.id);
                allFinished = false;
            }
        });

        // 如果所有算法都完成了，停止动画
        if (allFinished) {
            stopAllAnimations();
        }
    }, intervalTime);

    startAllButton.disabled = true;
    stopAllButton.disabled = false;
}

// 停止所有算法的动画
function stopAllAnimations() {
    if (globalAnimationInterval) {
        clearInterval(globalAnimationInterval);
        globalAnimationInterval = null;
    }

    startAllButton.disabled = false;
    stopAllButton.disabled = true;
}

// 重置所有算法
function resetAll() {
    stopAllAnimations();
    algorithms.forEach(algorithm => {
        algorithmStates[algorithm.id].currentStepIndex = 0;
        updateVisualization(algorithm.id);
    });
}

// 事件监听器
startAllButton.addEventListener('click', startAllAnimations);
stopAllButton.addEventListener('click', stopAllAnimations);

// 初始化页面
initialize();