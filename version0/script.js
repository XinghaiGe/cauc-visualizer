// --- 全局变量 ---
const ARRAY_SIZE = 10;
let originalArray = [];
let algorithmSteps = []; // 存储每一步的状态
let currentStep = 0;
let chart = null; // CanvasJS Chart object

// DOM 元素
const algorithmSelect = document.getElementById('algorithmSelect');
const startButton = document.getElementById('startButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const stopButton = document.getElementById('stopButton');
const currentStepDisplay = document.getElementById('currentStepDisplay');
const algorithmCodeDisplay = document.getElementById('algorithmCode');
const chartContainer = document.getElementById('chartContainer');

// --- 初始化函数 ---
function initialize() {
    // generateRandomArray();
    setupChart();
    updateControls(false); // 初始禁用控制按钮
    displayAlgorithmCode('shellSort'); // 默认显示希尔排序代码
}

function generateRandomArray() {
    originalArray = [];
    for (let i = 0; i < ARRAY_SIZE; i++) {
        originalArray.push(Math.floor(Math.random() * 90) + 10); // 10-99
    }
}

function setupChart(data = originalArray) {
    const dataPoints = data.map((value, index) => ({
        y: value,
        label: value.toString(),
        color: "#4CAF50" // 默认颜色：绿色
    }));

    chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: false, // 动画由我们手动控制
        title: {
            text: "数组可视化"
        },
        axisY: {
            title: "值",
            minimum: 0,
            maximum: 100 // 根据数据范围调整
        },
        data: [{
            type: "column", // 柱状图
            dataPoints: dataPoints
        }]
    });
    chart.render();
}

function updateControls(sortingActive) {
    startButton.disabled = sortingActive;
    prevButton.disabled = !sortingActive || currentStep === 0;
    nextButton.disabled = !sortingActive || currentStep >= algorithmSteps.length - 1;
    stopButton.disabled = !sortingActive;
}

function displayAlgorithmCode(algorithmName) {
    let code = '';
    switch (algorithmName) {
        case 'shellSort':
            code = `function shellSort(arr) {
    let n = arr.length;
    // 计算初始步长
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        // 对每个步长进行插入排序
        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j = i;
            // 插入排序
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
    return arr;
}`;
            break;
        case 'heapSort':
            code = `function heapSort(arr) {
    let n = arr.length;

    // 构建大顶堆
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // 逐个提取元素
    for (let i = n - 1; i > 0; i--) {
        // 交换堆顶元素和当前末尾元素
        [arr[0], arr[i]] = [arr[i], arr[0]];
        // 重新调整堆
        heapify(arr, i, 0);
    }
    return arr;
}

function heapify(arr, n, i) {
    let largest = i; // 根节点
    let left = 2 * i + 1; // 左子节点
    let right = 2 * i + 2; // 右子节点

    // 如果左子节点比根节点大
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    // 如果右子节点比根节点大
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    // 如果最大值不是根节点
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        // 递归地调整受影响的子树
        heapify(arr, n, largest);
    }
}`;
            break;
        case 'quickSort':
            code = `function quickSort(arr, low, high) {
    if (low < high) {
        // 找到基准的正确位置
        let pi = partition(arr, low, high);

        // 递归地对左右子数组进行排序
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    let pivot = arr[high]; // 选择最后一个元素作为基准
    let i = (low - 1); // 小于基准的元素的索引

    for (let j = low; j <= high - 1; j++) {
        // 如果当前元素小于等于基准
        if (arr[j] <= pivot) {
            i++; // 增加小于基准的元素的索引
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`;
            break;
    }
    algorithmCodeDisplay.innerHTML = code
        .split('\n')
        .map((line, index) => `<span class="code-line" data-line="${index + 1}">${line}</span>`)
        .join('');
}


// --- 算法记录器 ---
// 这个函数将被插入到算法内部，记录每一步的状态
// arr: 当前数组状态的副本
// highlightIndices: 需要高亮的数组索引
// highlightColors: 索引到颜色的映射，例如 {0: "#FFC107"}
// codeLine: 对应算法代码的行号，用于高亮显示
function recordStep(arr, highlightIndices = [], highlightColors = {}, codeLine = -1) {
    const dataPoints = arr.map((value, index) => ({
        y: value,
        label: value.toString(),
        color: highlightColors[index] || (highlightIndices.includes(index) ? "#FFC107" : "#4CAF50") // 默认绿色，高亮黄色
    }));

    algorithmSteps.push({
        arrayState: [...arr], // 记录当前数组的副本
        dataPoints: dataPoints,
        codeLine: codeLine, // 记录当前高亮的代码行
        // 还可以添加操作类型：'compare', 'swap', 'set' 等
    });
}

// --- 修改后的排序算法（插入 recordStep） ---

// 希尔排序
function shellSortWithSteps(arr) {
    let n = arr.length;
    algorithmSteps = []; // 重置步骤

    recordStep([...arr], [], {}, 2); // function shellSort(arr) {

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) { // Line 4
        recordStep([...arr], [], {}, 4); // for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) { // Line 6
            recordStep([...arr], [i, i - gap], { [i]: "#FFC107", [i - gap]: "#FFC107" }, 6); // 黄色：正在比较
            let temp = arr[i]; // Line 7
            recordStep([...arr], [i], { [i]: "#2196F3" }, 7); // 蓝色：取出待插入元素
            let j = i; // Line 8

            while (j >= gap && arr[j - gap] > temp) { // Line 10
                recordStep([...arr], [j, j - gap], { [j]: "#FFC107", [j - gap]: "#FFC107" }, 10); // 黄色：正在比较
                arr[j] = arr[j - gap]; // Line 11
                recordStep([...arr], [j, j - gap], { [j]: "#9C27B0", [j - gap]: "#9C27B0" }, 11); // 紫色：移动
                j -= gap; // Line 12
            }
            arr[j] = temp; // Line 14
            recordStep([...arr], [j], { [j]: "#00BCD4" }, 14); // 青色：插入完成
        }
    }
    // 排序完成后，所有元素都标记为已排序
    recordStep([...arr], [], {}, -1); // 最终状态，无特定高亮代码行
    return arr;
}

// 堆排序辅助函数
function heapifyWithSteps(arr, n, i) {
    let largest = i; // 根节点
    let left = 2 * i + 1; // 左子节点
    let right = 2 * i + 2; // 右子节点

    recordStep([...arr], [i, left, right].filter(idx => idx < n), { [i]: "#FFC107", [left]: "#FFEB3B", [right]: "#FFEB3B" }, 30); // Line 30: heapify function start, highlight root, left, right

    if (left < n && arr[left] > arr[largest]) { // Line 33
        recordStep([...arr], [left, largest], { [left]: "#FFC107", [largest]: "#FFC107" }, 33); // Comparing left child
        largest = left; // Line 34
    }

    if (right < n && arr[right] > arr[largest]) { // Line 37
        recordStep([...arr], [right, largest], { [right]: "#FFC107", [largest]: "#FFC107" }, 37); // Comparing right child
        largest = right; // Line 38
    }

    if (largest !== i) { // Line 41
        recordStep([...arr], [i, largest], { [i]: "#F44336", [largest]: "#F44336" }, 41); // Red: About to swap
        [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Line 42
        recordStep([...arr], [i, largest], { [i]: "#00BCD4", [largest]: "#00BCD4" }, 42); // Cyan: Swapped

        heapifyWithSteps(arr, n, largest); // Line 44: Recursive call
    }
}

// 堆排序
function heapSortWithSteps(arr) {
    let n = arr.length;
    algorithmSteps = [];
    recordStep([...arr], [], {}, 18); // function heapSort(arr) {

    // 构建大顶堆
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) { // Line 21
        recordStep([...arr], [i], { [i]: "#FF9800" }, 21); // Orange: Building heap, current parent
        heapifyWithSteps(arr, n, i);
    }

    // 逐个提取元素
    for (let i = n - 1; i > 0; i--) { // Line 25
        recordStep([...arr], [0, i], { [0]: "#F44336", [i]: "#F44336" }, 25); // Red: About to swap root with last element
        [arr[0], arr[i]] = [arr[i], arr[0]]; // Line 26
        recordStep([...arr], [0, i], { [0]: "#00BCD4", [i]: "#00BCD4" }, 26); // Cyan: Swapped
        recordStep([...arr], [i], { [i]: "#8BC34A" }, 26); // Light Green: Element placed in sorted position

        heapifyWithSteps(arr, i, 0); // Line 28: Re-heapify
    }
    recordStep([...arr], [], {}, -1); // Final sorted state
    return arr;
}

// 快速排序辅助函数
function partitionWithSteps(arr, low, high) {
    let pivot = arr[high]; // Line 58
    recordStep([...arr], [high], { [high]: "#FF9800" }, 58); // Orange: Pivot element
    let i = (low - 1); // Line 59
    recordStep([...arr], [i], { [i]: "#607D8B" }, 59); // Grey: i pointer

    for (let j = low; j <= high - 1; j++) { // Line 61
        recordStep([...arr], [j], { [j]: "#FFC107" }, 61); // Yellow: Current element j
        if (arr[j] <= pivot) { // Line 63
            recordStep([...arr], [j, pivot], { [j]: "#FFC107", [high]: "#FF9800" }, 63); // Comparing j with pivot
            i++; // Line 64
            recordStep([...arr], [i], { [i]: "#607D8B" }, 64); // Move i pointer
            recordStep([...arr], [i, j], { [i]: "#F44336", [j]: "#F44336" }, 65); // Red: About to swap
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Line 65
            recordStep([...arr], [i, j], { [i]: "#00BCD4", [j]: "#00BCD4" }, 65); // Cyan: Swapped
        }
    }
    recordStep([...arr], [i + 1, high], { [i + 1]: "#F44336", [high]: "#F44336" }, 68); // Red: About to place pivot
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Line 68
    recordStep([...arr], [i + 1], { [i + 1]: "#8BC34A" }, 68); // Light Green: Pivot placed
    return i + 1; // Line 69
}

// 快速排序
function quickSortWithSteps(arr, low, high) {
    // Initial call for quickSort should be: quickSortWithSteps(originalArray, 0, originalArray.length - 1);
    if (low === undefined && high === undefined) { // Only for the very first call
        algorithmSteps = [];
        recordStep([...arr], [], {}, 52); // function quickSort(arr, low, high) {
        low = 0;
        high = arr.length - 1;
    }

    if (low < high) { // Line 53
        recordStep([...arr], [low, high], { [low]: "#2196F3", [high]: "#2196F3" }, 53); // Blue: Current sub-array bounds
        let pi = partitionWithSteps(arr, low, high); // Line 55

        quickSortWithSteps(arr, low, pi - 1); // Line 56
        quickSortWithSteps(arr, pi + 1, high); // Line 57
    }
    if (low >= high) { // Base case for recursion, mark as sorted if single element or empty
        for (let k = low; k <= high; k++) {
            recordStep([...arr], [k], { [k]: "#8BC34A" }, -1); // Mark as sorted
        }
    }
    if (low === 0 && high === arr.length - 1) { // Final call, mark all as sorted
        recordStep([...arr], [], {}, -1); // Final sorted state
    }
    return arr;
}


// --- 可视化更新函数 ---
function updateVisualization() {
    if (algorithmSteps.length === 0) {
        currentStepDisplay.textContent = `当前是第 0 步`;
        setupChart(originalArray); // Reset chart
        highlightCodeLine(-1); // Remove all highlights
        updateControls(false);
        return;
    }

    const step = algorithmSteps[currentStep];
    if (!step) {
        console.error("Invalid step:", currentStep);
        return;
    }

    // 更新 CanvasJS 图表
    chart.options.data[0].dataPoints = step.dataPoints;
    chart.render();

    // 更新当前步骤显示
    currentStepDisplay.textContent = `当前是第 ${currentStep + 1} 步 / 共 ${algorithmSteps.length} 步`;

    // 高亮代码行
    highlightCodeLine(step.codeLine);

    // 更新按钮状态
    updateControls(true); // Sorting is active
    if (currentStep === 0) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if (currentStep >= algorithmSteps.length - 1) {
        nextButton.disabled = true;
        stopButton.disabled = false; // Allow stopping after completion
        startButton.disabled = false; // Allow starting new sort
    } else {
        nextButton.disabled = false;
    }
}

function highlightCodeLine(lineNumber) {
    const allCodeLines = document.querySelectorAll('.code-line');
    allCodeLines.forEach(line => line.classList.remove('highlight'));

    if (lineNumber !== -1) {
        const targetLine = document.querySelector(`.code-line[data-line="${lineNumber}"]`);
        if (targetLine) {
            targetLine.classList.add('highlight');
            // 滚动到视图中
            targetLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}


// --- 事件监听器 ---
startButton.addEventListener('click', () => {
    generateRandomArray(); // 每次开始都生成新数组
    const arrCopy = [...originalArray]; // 复制一份数组用于排序
    const selectedAlgorithm = algorithmSelect.value;

    switch (selectedAlgorithm) {
        case 'shellSort':
            shellSortWithSteps(arrCopy);
            break;
        case 'heapSort':
            heapSortWithSteps(arrCopy);
            break;
        case 'quickSort':
            quickSortWithSteps(arrCopy); // Quick sort needs initial call with full range
            break;
    }

    currentStep = 0; // 重置到第一步
    updateVisualization();
    updateControls(true); // 排序开始，启用控制按钮
});

prevButton.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateVisualization();
    }
});

nextButton.addEventListener('click', () => {
    if (currentStep < algorithmSteps.length - 1) {
        currentStep++;
        updateVisualization();
    }
});

stopButton.addEventListener('click', () => {
    algorithmSteps = []; // 清空步骤
    currentStep = 0;
    generateRandomArray(); // 生成新数组
    setupChart(); // 重置图表
    updateControls(false); // 禁用控制按钮
    currentStepDisplay.textContent = `当前是第 0 步`;
    highlightCodeLine(-1); // 移除所有高亮
});

algorithmSelect.addEventListener('change', (event) => {
    displayAlgorithmCode(event.target.value);
    stopButton.click(); // Reset state when algorithm changes
});


// --- 页面加载完成时初始化 ---
window.onload = initialize;

