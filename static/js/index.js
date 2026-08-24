window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

});

// Case dots – initialise as early as possible (independent of jQuery)
document.addEventListener('DOMContentLoaded', function () {
  const cases = Array.from(document.querySelectorAll('#cases-wrapper [data-case]'));
  const dotsContainer = document.getElementById('cases-dots');

  if (cases.length && dotsContainer) {
    let idx = 0;
    let animating = false;
    var ANIM_DURATION = 400; // ms, must match CSS animation-duration

    // If dots already exist in HTML, use them; otherwise create them dynamically
    var existingDots = dotsContainer.querySelectorAll('.case-dot');
    if (existingDots.length === 0) {
      cases.forEach(function (_, i) {
        var dot = document.createElement('span');
        dot.classList.add('case-dot');
        dot.setAttribute('data-index', i);
        if (i === 0) dot.classList.add('is-active');
        dotsContainer.appendChild(dot);
      });
    }

    const dots = Array.from(dotsContainer.querySelectorAll('.case-dot'));

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        if (animating || i === idx) return;
        switchTo(i);
      });
    });

    function clearAnimClasses(el) {
      el.classList.remove('slide-in-right', 'slide-in-left', 'slide-out-right', 'slide-out-left');
    }

    function switchTo(newIdx) {
      if (animating) return;
      animating = true;

      var oldIdx = idx;
      var direction = newIdx > oldIdx ? 'left' : 'right';
      var oldCase = cases[oldIdx];
      var newCase = cases[newIdx];

      // Pause all videos
      cases.forEach(function (caseEl) {
        var videos = caseEl.querySelectorAll('video');
        videos.forEach(function (video) { video.pause(); });
      });

      // Clear any leftover animation classes
      cases.forEach(function (el) { clearAnimClasses(el); });

      // Animate old case out
      oldCase.classList.add(direction === 'left' ? 'slide-out-left' : 'slide-out-right');

      // Animate new case in
      newCase.classList.add(direction === 'left' ? 'slide-in-right' : 'slide-in-left');

      // Update dots immediately
      idx = newIdx;
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === idx); });

      // After animation ends, clean up
      setTimeout(function () {
        clearAnimClasses(oldCase);
        oldCase.classList.remove('is-active');

        clearAnimClasses(newCase);
        newCase.classList.add('is-active');

        animating = false;
      }, ANIM_DURATION);
    }

    // Initial render (no animation)
    cases.forEach(function (el, i) { el.classList.toggle('is-active', i === idx); });
    dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === idx); });
  }
});

// Interactive ESTOQ47hvdg trajectory demo.
document.addEventListener('DOMContentLoaded', function () {
  var stage = document.getElementById('case-demo-stage');
  var startButton = document.getElementById('case-demo-start');
  var timeline = document.getElementById('case-demo-timeline');
  var reasoningPanel = document.getElementById('case-demo-reasoning');
  var status = document.getElementById('case-demo-status');
  var video = document.getElementById('case-demo-video');
  var question = document.getElementById('case-demo-question');
  var duration = document.getElementById('case-demo-duration');
  var previousButton = document.getElementById('case-demo-prev');
  var nextButton = document.getElementById('case-demo-next');
  var currentCaseLabel = document.getElementById('case-demo-current');
  var totalCaseLabel = document.getElementById('case-demo-total');

  if (!stage || !startButton || !timeline || !reasoningPanel || !status || !video || !question || !duration || !previousButton || !nextButton) return;

  var frameRoot = './static/frames/13_0b5414936196/';
  var overviewFrameRoot = './static/videos/ESTOQ47hvdg_64frames/';
  var overviewFrames = Array.from({ length: 64 }, function (_, index) {
    var frameNumber = String(index + 1).padStart(3, '0');
    return ['frame_' + frameNumber + '.jpg', '#' + String(index + 1).padStart(2, '0')];
  });
  var firstCropFrames = [
    ['frame_0000_t0.000s.png', '0.000s'],
    ['frame_0001_t0.556s.png', '0.556s'],
    ['frame_0002_t1.111s.png', '1.111s'],
    ['frame_0003_t1.667s.png', '1.667s'],
    ['frame_0004_t2.222s.png', '2.222s'],
    ['frame_0005_t2.778s.png', '2.778s'],
    ['frame_0006_t3.333s.png', '3.333s'],
    ['frame_0007_t3.889s.png', '3.889s'],
    ['frame_0008_t4.444s.png', '4.444s'],
    ['frame_0009_t5.000s.png', '5.000s']
  ];
  var secondCropFrames = [
    ['frame_0000_t96.000s.png', '96.000s'],
    ['frame_0001_t96.571s.png', '96.571s'],
    ['frame_0002_t97.143s.png', '97.143s'],
    ['frame_0003_t97.714s.png', '97.714s'],
    ['frame_0004_t98.286s.png', '98.286s'],
    ['frame_0005_t98.857s.png', '98.857s'],
    ['frame_0006_t99.429s.png', '99.429s'],
    ['frame_0007_t100.000s.png', '100.000s']
  ];

  var firstCaseSteps = [
    {
      kind: 'overview',
      label: 'Video sampling · 64 frames',
      text: 'The original video is uniformly sampled into 64 frames before reasoning begins.',
      frames: overviewFrames,
      frameRoot: overviewFrameRoot,
      overview: true,
      delayAfter: 1900
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>To answer the question about the year of the third World Cup goal, I need to identify the player and verify that he scored in 2006 and 2010. The opening title card likely names the player and references 2006, but I need to look for evidence of a 2010 appearance. The first step is to crop the video segment that contains the title card (0-5s) to confirm the player's name and any 2010 mention. I will also look for a segment showing the 2010 World Cup jersey (around 96-100s) to support the timeline. Since the player is identified as Rafael Márquez based on the title 'RAFAEL MÁRQUEZ' and the 2006 context, I hypothesize he is a Mexican or Mexican-born player who played in 2010 for Mexico. I need to check the 2006 and 2010 clips for goal details to confirm he scored both times and then determine his third World Cup goal year.</think>
<tool_call>{"name": "crop_video", "arguments": {"start_time": 0.0, "end_time": 5.0}}</tool_call>`
    },
    {
      kind: 'evidence',
      label: 'crop_video result · 0–5s',
      text: 'crop_video tool execution successful: Extracted 10 frames from 0.0s to 5.0s.',
      frames: firstCropFrames
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The cropped frames from 0-5s confirm the title card: 'RAFAEL MÁRQUEZ', '2006', 'GERMANY'. This identifies the player as Rafael Marquez. The question mentions he also scored in the 2010 World Cup. I now need to verify the 2010 appearance. The next segment (96-100s) shows a player in a green jersey with 2010 World Cup context. I will crop that segment to confirm it is Rafael Marquez in the 2010 Mexico jersey and search for goal evidence in either the 2006 or 2010 clips. Since the user asks for the year of his third World Cup goal, I need to know his full World Cup goal history. I'll first crop the 2010 segment to confirm the timeline and then text_search for Rafael Marquez's World Cup goals.</think>
<tool_call>{"name": "crop_video", "arguments": {"start_time": 96.0, "end_time": 100.0}}</tool_call>`
    },
    {
      kind: 'evidence',
      label: 'crop_video result · 96–100s',
      text: 'crop_video tool execution successful: Extracted 8 frames from 96.0s to 100.0s.',
      frames: secondCropFrames
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The video shows a player taking a penalty kick in a stadium with a large crowd, and the goalkeeper is diving to his right. The video overview indicates this scene is from the 2006 World Cup, as shown in the title card 'RAFAEL MÁRQUEZ 2006 GERMANY'. The player is wearing a green jersey, which is Mexico's away kit. However, the identity of the player is uncertain—this could be Rafael Marquez Sr. or Rafael Marquez Jr. To determine the correct player and confirm that he scored in both the 2006 and 2010 World Cups, I need to verify the visual identity. I will use image_search on a representative frame of the penalty kick to confirm the player's identity. Once confirmed, I can proceed to search for information about his World Cup goals and determine the year of his third goal.</think>
<tool_call>{"name": "image_search", "arguments": {"timestamp": 38.0}}</tool_call>`
    },
    {
      kind: 'evidence',
      label: 'image_search result · 38s',
      text: 'image_search tool execution successful. The returned visual evidence is shown below; one result claims the player scored in the 2006, 2010, and 2014 World Cups, but its source is not authoritative.',
      frames: [['image_search_t38.000s.png', '38.000s']],
      single: true
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The image_search returned a mostly irrelevant Reddit post about carpentry and a Facebook post with no information. One search snippet claims 'the player scored in the 2006, 2010, and 2014 World Cups' but that is from a non-authoritative Reddit context. To confidently answer, I need to verify Rafael Márquez's World Cup goal history from a reliable source. I will use text_search with the query 'Rafael Márquez World Cup goals 2006 2010 2014' to find a trustworthy article or Wikipedia entry.</think>
<tool_call>{"name": "text_search", "arguments": {"query": "Rafael Márquez scored World Cup goals 2006 2010 2014"}}</tool_call>`
    },
    {
      kind: 'results',
      label: 'text_search result',
      text: 'Search for “Rafael Márquez scored World Cup goals 2006 2010 2014” returned 7 results. The most relevant evidence includes:',
      results: [
        'Wikipedia: Márquez captained Mexico at the 2010 World Cup and scored in the opening match against South Africa.',
        'FIFA: Rafael Márquez Goal 78′ — South Africa v Mexico, 2010 FIFA World Cup.',
        'MLS: Márquez scored against Argentina in the 2006 FIFA World Cup.'
      ]
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The text_search returned several relevant results. Result 1 is Wikipedia, result 5 is FIFA.com, and result 6 mentions scoring in 2006. To verify the year of his third World Cup goal, I need to check a reliable source. The snippet from result 1 mentions he captained Mexico in 2010 and scored. Result 5 shows a FIFA video of his 2010 goal. I will visit the Wikipedia page to get a complete list of his World Cup goals, as a single authoritative source. If the Wikipedia page explicitly lists his World Cup goal appearances, I can determine the third year. The player is identified from the title card as Rafael Márquez; I need to confirm his goal history.</think>
<tool_call>{"name": "visit", "arguments": {"url": ["https://en.wikipedia.org/wiki/Rafael_M%C3%A1rquez"], "goal": "Find the list of Rafael Márquez's World Cup goals and the year of his third goal."}}</tool_call>`
    },
    {
      kind: 'results',
      label: 'visit result · Wikipedia',
      text: 'The page confirms that Rafael Márquez scored in the 2002, 2006, 2010, 2014, and 2018 World Cups. His third World Cup goal was in 2014.',
      results: [
        'Evidence: Márquez scored in the 2002, 2006, 2010, 2014, and 2018 World Cups.',
        'Summary: His third World Cup goal was in 2014.'
      ]
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The visit to Wikipedia confirms that Rafael Márquez scored in 2002, 2006, 2010, 2014, and 2018 World Cups. His third goal was in the 2014 World Cup. The video's title card says '2006' and the video mentions 2010, so the third is 2014. This is a direct, authoritative answer from Wikipedia. No further tool calls are needed.</think>
<answer>2014</answer>`
    },
    {
      kind: 'answer',
      label: 'Ground Truth · Correct',
      text: 'The model reasoning matches the ground-truth answer.',
      answer: '2014 ✓'
    }
  ];

  var secondFrameRoot = './static/frames/289_9c0c56413674/';
  var secondOverviewFrameRoot = './static/videos/3yIk16Bg64A_64frames/';
  var secondOverviewFrames = Array.from({ length: 64 }, function (_, index) {
    var frameNumber = String(index + 1).padStart(3, '0');
    return ['frame_' + frameNumber + '.jpg', '#' + String(index + 1).padStart(2, '0')];
  });
  var coinCropTimestamps = [
    '2407.000', '2427.613', '2448.226', '2468.839', '2489.452', '2510.065', '2530.677', '2551.290',
    '2571.903', '2592.516', '2613.129', '2633.742', '2654.355', '2674.968', '2695.581', '2716.194',
    '2736.806', '2757.419', '2778.032', '2798.645', '2819.258', '2839.871', '2860.484', '2881.097',
    '2901.710', '2922.323', '2942.935', '2963.548', '2984.161', '3004.774', '3025.387', '3046.000'
  ];
  var coinCropFrames = coinCropTimestamps.map(function (timestamp, index) {
    return ['frame_' + String(index).padStart(4, '0') + '_t' + timestamp + 's.png', timestamp + 's'];
  });

  var secondCaseSteps = [
    {
      kind: 'overview',
      label: 'Video sampling · 64 frames',
      text: 'The original long video is uniformly sampled into 64 frames before reasoning begins.',
      frames: secondOverviewFrames,
      frameRoot: secondOverviewFrameRoot,
      overview: true,
      delayAfter: 1900
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The video shows ancient Roman coins with inscriptions such as MAGN and PRO CO, and a portrait of a bearded man wearing a radiate crown, strongly suggesting a Hercules type (M.AGN.PRO.CO). This indicates the coin was minted by a Roman official whose name began with 'Agn' and was issued during the reign of Augustus. The official likely belonged to the gens Agnenna (or a variant like Agonina) and minted the coin as a curator or official at a sanctuary. The question asks which son of the legendary king Numa is the ancestor of this gens. I recall that Numa's son Agnus (or a similar figure) is traditionally considered the ancestor of the Agnennae. However, I need to verify the exact gens name from the coin's inscription and then trace it back to Numa's son. To start, I will crop the video around the coin to get a clearer view of the inscription and the portrait, especially the obverse legend and the radiate crown—these are key to identifying the official and the gens. The first crop_video should target a section where the coin is sharply in focus and the obverse legend is readable, likely in the part where the coin is compared to a bust or shown in detail. I will avoid making a definite conclusion about the son's name yet.</think>
<tool_call>{"name": "crop_video", "arguments": {"start_time": 2407.0, "end_time": 3046.0}}</tool_call>`
    },
    {
      kind: 'evidence',
      label: 'crop_video result · 2407–3046s',
      text: 'crop_video tool execution successful: Extracted 32 frames from 2407.0s to 3046.0s.',
      frames: coinCropFrames,
      frameRoot: secondFrameRoot
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The video shows close-ups of ancient Roman coins, with one prominently displaying the inscription 'M.AGN.PRO.CO' and a radiate crown, suggesting a connection to Hercules. The name 'AGN' likely refers to a gens or family name, possibly Agnenna or Agonina. To identify the specific son of Numa Pompilius who is the ancestor of this gens, I need to determine the exact meaning of 'AGN' in this context. The radiate crown is a definitive attribute of Hercules, supporting the hypothesis that this coin honors Hercules. I should now search for known Roman officials named Agn with such a coin and trace their lineage back to Numa's son. A text search for 'M. AGN. PRO CO coin Augustus Hercules' or 'Agn gens Numa Pompilius son' will help confirm the gens name and its historical connection to Numa's lineage.</think>
<tool_call>{"name": "text_search", "arguments": {"query": "M. AGN. PRO CO coin Augustus"}}</tool_call>`
    },
    {
      kind: 'results',
      label: 'text_search result',
      text: 'The query returned 9 broad results about Augustus-era coinage, but none identified the specific “M. AGN. PRO CO” inscription.'
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The generic search didn't reveal the specific coin type 'M. AGN. PRO CO'. I need a more precise text_search query that uses the concrete inscription from the video and the radiate crown clue to identify the official and his gens. The radiate crown suggests a Hercules type, and 'M.AGN.PRO.CO' likely stands for 'Magnus Agn ... Pro Co ...' or 'M. Agn. Pro. Co.' Perhaps the full name is 'M. Agn. Pro. Co.' or 'Marcus Agn. Pro. Co.' I should search for 'M. Agn. Hercules coin Augustus radiate crown' or 'Agn PRO CO coin Augustus' to find the specific official and then trace the gens back to Numa's son. I'll refine the query using the visual anchor 'radiate crown Hercules'.</think>
<tool_call>{"name": "text_search", "arguments": {"query": "M. AGN. PRO CO Hercules radiate crown coin Augustus"}}</tool_call>`
    },
    {
      kind: 'results',
      label: 'text_search result',
      text: 'The refined query returned 9 results about radiate crowns and Roman coinage, but still did not identify the official.'
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The radiate crown search didn't specifically identify the coin with 'M.AGN.PRO.CO'. The inscription 'M.AGN.PRO.CO' is the key. I need to search for 'Agn' as a gens name in Roman context linked to Numa's son. Perhaps the gens is 'Agnenna' and the son of Numa is 'Agnus'. But I should verify through a scholarly source about Numa's lineage. I'll search for 'Agnenna gens Numa Pompilius son' to find which specific son of Numa is considered the ancestor of this gens, and then later trace the official's name. However, I should first try to identify the specific official from the inscription. Another possibility: 'M.AGN.PRO.CO' could be 'Magnus Agoninus' (Gens Agonina). I'll search for 'Gens Agonina Numa Pompilius' to see. Let's search for 'Agn PRO CO Roman official Augustus' with a more focused query.</think>
<tool_call>{"name": "text_search", "arguments": {"query": "Agn gens Roman official Augustus ancestor Numa Pompilius"}}</tool_call>`
    },
    {
      kind: 'results',
      label: 'text_search result',
      text: 'The results surfaced general references for Numa Pompilius, but did not establish the official or gens connected to the coin.'
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The coin inscription 'M.AGN.PRO.CO' and the radiate crown suggest the official's name includes 'Agn' (gens Agnenna or Agonina). To identify the exact son of Numa who is the ancestor of this gens, I need to search for 'Agnenna gens Numa Pompilius son' or 'Agnor gens Numa'. The son might be 'Agnus' or 'Agnor'. I'll search for 'Agnenna gens' to see if it's associated with a specific son of Numa.</think>
<tool_call>{"name": "text_search", "arguments": {"query": "Agnenna gens Numa Pompilius son"}}</tool_call>`
    },
    {
      kind: 'results',
      label: 'text_search result',
      text: 'The search returned Numa’s traditional family list—including Pompo, Pinus, and Calpus—but no direct match for “Agnenna.”'
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The generic 'Agnenna gens' search did not directly reveal the son of Numa. I need to identify the specific official from the 'M.AGN.PRO.CO' inscription and the radiate crown. The radiate crown is a strong attribute of Hercules, confirming the type as Hercules. The inscription likely stands for 'Magnus Agn. Pro. Co.' or 'Marcus Agn. Pro. Co.'. A better approach is to search for coins with the exact legend 'M. AGN. PRO. CO.' or similar to find the official's full name on a specific coin. I will use a refined text_search with the full legend and 'Hercules' to pinpoint the issuer, then trace the gens back to Numa's son.</think>
<tool_call>{"name": "text_search", "arguments": {"query": "\"M. AGN. PRO. CO\" coin Hercules radiate crown Augustus"}}</tool_call>`
    },
    {
      kind: 'results',
      label: 'text_search result',
      text: 'No search results found for “M. AGN. PRO. CO” coin Hercules radiate crown Augustus.'
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The search for the exact legend 'M. AGN. PRO. CO' returned no results, likely because the inscription is incomplete or the official's name is written differently. The radiate crown suggests a Hercules type. A coin of Hercules with a radiate crown confirms the divinity. I need to identify the issuer from a broader search of coins from Augustus' reign with a radiate crown and a legend starting with 'M.' and containing 'AGN'. Perhaps the official is 'M. Agn. Pro. Co.' or 'Marcus Agn. Pro. Co.' I should search for 'Agonina gens Numa Pompilius son' as the gens might be Agonina rather than Agnenna. Alternatively, the inscription might read 'M. AGNOR. PRO. CO.' or 'M. AGRIPP. PRO. CO.' but the close-up shows 'M.AGN.PRO.CO' clearly. Wait, maybe the legend is 'M. AGN. PRO. CO.' with 'AGN' as a praenomen or nomen. Let's search for 'M. AGN' Roman official Augustus to see if any known official has a name starting with 'Agn'. If nothing, I might need to image_search a frame of the coin to get a better look at the full legend. I'll first attempt a search with 'M. AGN.' as a possible name, but the gens Agnenna is obscure. Another possibility: 'M. AEMILIVS' but the image clearly shows 'A' followed by 'G'. Let me try 'M. AGN. PRO. CO' with a simpler query. I'll search for 'M. AGN PRO CO coin' without the radiate crown qualifiers.</think>
<tool_call>{"name": "text_search", "arguments": {"query": "\"M. AGN. PRO. CO\" coin Augustus"}}</tool_call>`
    },
    {
      kind: 'results',
      label: 'text_search result',
      text: 'No search results found for “M. AGN. PRO. CO” coin Augustus.'
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The video shows ancient Roman coins, and the question asks which son of Numa Pompilius is the ancestor of the gens associated with the Roman official who minted a coin during Augustus's reign. I need to identify the official from the coin's inscription, which appears to include the name 'Agn' or a similar variant. Since direct searches for 'M. AGN. PRO. CO' and 'M. AGN' returned no results, the legend may be misread or stylized. The coin includes a radiate crown, a feature common on early Roman coinage, but it doesn't narrow the search. I will crop a clearer segment of the coin to examine the full legend, focusing on the area around the radiate crown and the bust to confirm the spelling. A closer view may reveal the official's name more accurately, especially if the 'A' in 'AGN' is actually an 'A' followed by a different letter, such as 'E' or 'M'. I will also consider that the official might be a known figure like Agrippa, but the name doesn't match. I will now perform a text search for 'Augustan coin radiate crown Hercules Marcus' to cross-reference the type and see if any known official is associated with this imagery.</think>
<tool_call>{"name": "text_search", "arguments": {"query": "Augustus coin radiate crown Hercules Marcus official"}}</tool_call>`
    },
    {
      kind: 'results',
      label: 'text_search result',
      text: 'The broader search returned 9 results about radiate crowns and ancient coins, but no conclusive issuer identification.'
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The text searches for the specific legend 'M. AGN. PRO. CO' and variations came up empty. The close-up shows 'M.AGN.PRO.CO' on the coin and a bust of a bearded man with a radiate crown (Hercules). I still need to identify the Roman official who minted this coin. The radiate crown suggests Hercules, and the legend might be from a sanctuary issue. I will use image_search on a frame of the coin (e.g., timestamp around 2800s where the coin is shown with the bust) to get a web identification of this specific coin type. This will help me identify the official and then trace the gens back to Numa's son.</think>
<tool_call>{"name": "image_search", "arguments": {"timestamp": 2800.0}}</tool_call>`
    },
    {
      kind: 'evidence',
      label: 'image_search result · 2800s',
      text: 'The image search identifies the coin with Cn. Calpurnius Piso and links the gens Calpurnia to Calpus, a son of Numa Pompilius.',
      frames: [['image_search_t2800.000s.png', '2800.000s']],
      frameRoot: secondFrameRoot,
      single: true
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>Image_search returned a result linking to coinantix.com stating the coin was minted by Cn. Calpurnius Piso and that the gens Calpurnia descends from Numa Pompilius's son Calpus. However, another result from numisforums.com is a repetitive ramble that fails to clearly state the son's name. The coinantix.com source seems credible but I need to visit the page to confirm the specific son of Numa who is the ancestor of the Calpurnii. The question asks for the specific son of Numa who is the ancestor of the gens associated with the official who minted the coin. If the coin was minted by Cn. Calpurnius Piso during Augustus's reign, then the gens is Calpurnia, and its ancestor is Calpus, Numa's son. I will visit coinantix.com to extract the exact statement about Calpus being Numa's son and ancestor of the Calpurnii.</think>
<tool_call>{"name": "visit", "arguments": {"url": ["https://coinantix.com/product/pompey-magnus-denarius-silver/"], "goal": "Identify the specific son of Numa Pompilius mentioned as the ancestor of the gens Calpurnia, and confirm the official (Cn. Calpurnius Piso) minted the coin."}}</tool_call>`
    },
    {
      kind: 'results',
      label: 'visit result · CoinAntix',
      text: 'The page states that the coin was struck by Cn. Calpurnius Piso and that the gens Calpurnia traditionally descended from Calpus, son of Numa Pompilius.',
      results: [
        'Evidence: “Pompilius had a son by the name of Calpus, from whom the gens Calpurnia was descended.”',
        'Summary: The specific son is Calpus.'
      ]
    },
    {
      kind: 'model',
      label: 'VideoRover',
      text: `<think>The visit to coinantix.com confirmed that the coin was minted by Cn. Calpurnius Piso, a member of the gens Calpurnia. According to tradition, the gens Calpurnia descended from Calpus, the son of Numa Pompilius. The question asks for the specific son of the legendary king Numa who is the ancestor of the gens associated with the official who minted the coin. The official is Cn. Calpurnius Piso, gens Calpurnia, and its ancestor is Calpus, son of Numa. Therefore, the answer is Calpus.</think>
<answer>Calpus</answer>`
    },
    {
      kind: 'answer',
      label: 'Ground Truth · Correct',
      text: 'The model reasoning matches the ground-truth answer.',
      answer: 'Calpus ✓'
    }
  ];

  var cases = [
    {
      video: './static/videos/ESTOQ47hvdg.mp4',
      poster: './static/frames/13_0b5414936196/frame_0000_t0.000s.png',
      duration: '01:47',
      question: 'The player in this video mentions scoring in the 2006 and 2010 World Cups. What is the year of the third World Cup in which he scored a goal?',
      steps: firstCaseSteps
    },
    {
      video: './static/videos/3yIk16Bg64A.mp4',
      poster: './static/frames/289_9c0c56413674/frame_0019_t2798.645s.png',
      duration: '55:14',
      question: 'The video displays a close-up of ancient Roman coins. Which specific son of the legendary king Numa is the ancestor of the noble family (gens) associated with the name of the Roman official who minted a coin shown in the video during the reign of Emperor Augustus?',
      steps: secondCaseSteps
    }
  ];
  var activeCaseIndex = 0;

  var timers = [];
  var running = false;
  var switchingCase = false;

  function createStep(step, index) {
    var item = document.createElement('article');
    item.className = 'case-demo-step case-demo-' + step.kind + (step.raw ? ' is-raw' : '') + (step.framesFirst ? ' frames-first' : '');

    var card = document.createElement('div');
    card.className = 'case-demo-step-card';

    var heading = document.createElement('div');
    heading.className = 'case-demo-step-label';

    var label = document.createElement('span');
    label.textContent = step.label;
    var number = document.createElement('span');
    number.className = 'case-demo-step-number';
    number.textContent = String(index + 1).padStart(2, '0');
    heading.appendChild(label);
    heading.appendChild(number);
    card.appendChild(heading);

    var text = document.createElement('p');
    text.className = 'case-demo-step-text';
    text.textContent = step.text;
    if (!step.framesFirst) card.appendChild(text);

    if (step.frames) {
      var frameGrid = document.createElement('div');
      frameGrid.className = 'case-demo-frame-grid' + (step.single ? ' is-single' : '');
      step.frames.forEach(function (frame) {
        var figure = document.createElement('figure');
        figure.className = 'case-demo-frame';
        var image = document.createElement('img');
        image.src = (step.frameRoot || frameRoot) + frame[0];
        image.alt = step.overview ? 'Uniformly sampled video frame ' + frame[1] : 'Extracted video frame at ' + frame[1];
        image.loading = 'lazy';
        var caption = document.createElement('figcaption');
        caption.textContent = frame[1];
        figure.appendChild(image);
        figure.appendChild(caption);
        frameGrid.appendChild(figure);
      });
      card.appendChild(frameGrid);
      if (step.framesFirst) card.appendChild(text);
    }

    if (step.results) {
      var resultList = document.createElement('ul');
      resultList.className = 'case-demo-result-list';
      step.results.forEach(function (result) {
        var resultItem = document.createElement('li');
        resultItem.textContent = result;
        resultList.appendChild(resultItem);
      });
      card.appendChild(resultList);
    }

    if (step.answer) {
      var answer = document.createElement('strong');
      answer.textContent = step.answer;
      card.appendChild(answer);
    }

    item.appendChild(card);
    return item;
  }

  function setButton(label, iconClass, disabled) {
    startButton.disabled = disabled;
    startButton.innerHTML = '';
    var labelNode = document.createElement('span');
    labelNode.textContent = label;
    var icon = document.createElement('span');
    icon.className = 'icon';
    icon.setAttribute('aria-hidden', 'true');
    var iconGlyph = document.createElement('i');
    iconGlyph.className = iconClass;
    icon.appendChild(iconGlyph);
    startButton.appendChild(labelNode);
    startButton.appendChild(icon);
  }

  function clearPlayback() {
    timers.forEach(function (timer) { window.clearTimeout(timer); });
    timers = [];
    timeline.innerHTML = '';
    timeline.scrollTop = 0;
    stage.classList.remove('is-running', 'is-complete');
  }

  function showCase(index) {
    clearPlayback();
    running = false;
    activeCaseIndex = (index + cases.length) % cases.length;

    var selectedCase = cases[activeCaseIndex];
    video.pause();
    video.src = selectedCase.video;
    video.poster = selectedCase.poster;
    video.load();
    question.textContent = selectedCase.question;
    duration.textContent = selectedCase.duration;
    status.textContent = 'Ready';
    setButton('Start', 'fas fa-arrow-right', false);

    if (currentCaseLabel) currentCaseLabel.textContent = String(activeCaseIndex + 1);
    if (totalCaseLabel) totalCaseLabel.textContent = String(cases.length);
  }

  function switchCase(offset) {
    if (switchingCase) return;

    var targetIndex = (activeCaseIndex + offset + cases.length) % cases.length;
    var direction = offset > 0 ? 'next' : 'prev';
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    timers.forEach(function (timer) { window.clearTimeout(timer); });
    timers = [];
    running = false;

    if (reducedMotion) {
      showCase(targetIndex);
      return;
    }

    switchingCase = true;
    previousButton.disabled = true;
    nextButton.disabled = true;
    stage.classList.add('is-case-leaving-' + direction);

    window.setTimeout(function () {
      stage.classList.remove('is-case-leaving-' + direction);
      showCase(targetIndex);
      stage.classList.add('is-case-entering-' + direction);

      window.setTimeout(function () {
        stage.classList.remove('is-case-entering-' + direction);
        previousButton.disabled = false;
        nextButton.disabled = false;
        switchingCase = false;
      }, 340);
    }, 200);
  }

  function parseTrajectoryRecords(rawText) {
    var trimmed = rawText.trim().replace(/,\s*$/, '');
    return JSON.parse(trimmed.charAt(0) === '[' ? trimmed : '[' + trimmed + ']');
  }

  function applyRawTrajectory(record, steps) {
    var assistantMessages = record.trajectory.filter(function (message) {
      return message.role === 'assistant';
    });
    var toolResultMessages = record.trajectory.filter(function (message, index) {
      return message.role === 'user' && index > 1;
    });
    var modelSteps = steps.filter(function (step) {
      return step.kind === 'model';
    });
    var toolResultSteps = steps.filter(function (step) {
      return step.kind === 'evidence' || step.kind === 'results';
    });

    if (assistantMessages.length !== modelSteps.length || toolResultMessages.length !== toolResultSteps.length) {
      throw new Error('Trajectory message count does not match the rendered case steps.');
    }

    modelSteps.forEach(function (step, index) {
      step.text = assistantMessages[index].content;
      step.raw = true;
    });
    toolResultSteps.forEach(function (step, index) {
      var rawContent = toolResultMessages[index].content;
      var startsWithImage = /^\s*<image>/.test(rawContent);
      step.text = rawContent
        .replace(/<image>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      step.framesFirst = Boolean(startsWithImage && step.frames && step.frames.length);
      step.raw = true;
      delete step.results;
    });
  }

  function loadRawTrajectories() {
    return fetch('./static/data/case.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Unable to load case.json: HTTP ' + response.status);
        return response.text();
      })
      .then(function (rawText) {
        var records = parseTrajectoryRecords(rawText);
        var footballCase = records.find(function (record) {
          return String(record.video_url || record.youtube_url || '').indexOf('ESTOQ47hvdg') !== -1;
        });
        var coinCase = records.find(function (record) {
          return String(record.video_url || record.youtube_url || '').indexOf('3yIk16Bg64A') !== -1;
        });

        if (!footballCase || !coinCase) throw new Error('Required case records were not found in case.json.');
        applyRawTrajectory(footballCase, firstCaseSteps);
        applyRawTrajectory(coinCase, secondCaseSteps);
      });
  }

  function startPlayback() {
    if (running) return;
    clearPlayback();
    running = true;
    stage.classList.add('is-running');
    status.textContent = 'Reasoning';
    setButton('Running', 'fas fa-circle-notch fa-spin', true);

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var initialDelay = reducedMotion ? 80 : 620;
    var elapsed = initialDelay;
    var steps = cases[activeCaseIndex].steps;

    steps.forEach(function (step, index) {
      var timer = window.setTimeout(function () {
        timeline.appendChild(createStep(step, index));
        timeline.scrollTop = timeline.scrollHeight;

        if (index === steps.length - 1) {
          running = false;
          stage.classList.remove('is-running');
          stage.classList.add('is-complete');
          status.textContent = 'Complete';
          setButton('Replay', 'fas fa-redo-alt', false);
        }
      }, elapsed);
      timers.push(timer);
      elapsed += reducedMotion ? 180 : (step.delayAfter || 1050);
    });
  }

  startButton.addEventListener('click', startPlayback);
  previousButton.addEventListener('click', function () {
    switchCase(-1);
  });
  nextButton.addEventListener('click', function () {
    switchCase(1);
  });

  setButton('Loading', 'fas fa-circle-notch fa-spin', true);
  status.textContent = 'Loading';
  previousButton.disabled = true;
  nextButton.disabled = true;
  loadRawTrajectories()
    .catch(function (error) {
      console.error(error);
      status.textContent = 'Fallback';
    })
    .finally(function () {
      showCase(0);
      previousButton.disabled = false;
      nextButton.disabled = false;
    });
});
