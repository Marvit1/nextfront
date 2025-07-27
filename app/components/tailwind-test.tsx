export default function TailwindTest() {
  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Tailwind CSS Test
        </h2>
        
        <div className="space-y-4">
          {/* Basic Colors */}
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            Blue background
          </div>
          
          <div className="bg-green-500 text-white p-4 rounded-lg">
            Green background
          </div>
          
          <div className="bg-red-500 text-white p-4 rounded-lg">
            Red background
          </div>
          
          <div className="bg-yellow-500 text-black p-4 rounded-lg">
            Yellow background
          </div>
          
          <div className="bg-purple-500 text-white p-4 rounded-lg">
            Purple background
          </div>
          
          {/* Buttons */}
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Purple Button
          </button>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Blue Button
          </button>
          
          {/* Text Styles */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-bold">Bold text</p>
            <p className="italic">Italic text</p>
            <p className="underline">Underlined text</p>
            <p className="text-center">Centered text</p>
          </div>
          
          {/* Spacing */}
          <div className="border-2 border-gray-300 p-4 m-2">
            <p className="mb-2">Margin bottom</p>
            <p className="mt-2">Margin top</p>
            <p className="ml-2">Margin left</p>
            <p className="mr-2">Margin right</p>
          </div>
          
          {/* Flexbox */}
          <div className="flex justify-between items-center bg-gray-200 p-4 rounded">
            <span>Left</span>
            <span>Center</span>
            <span>Right</span>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-200 p-2 rounded text-center">Grid 1</div>
            <div className="bg-green-200 p-2 rounded text-center">Grid 2</div>
          </div>
          
          {/* Status */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            If you can see colored boxes, buttons, and styled text, Tailwind CSS is working!
          </div>
        </div>
      </div>
    </div>
  );
} 