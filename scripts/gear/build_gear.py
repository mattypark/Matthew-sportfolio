# The gear scene at the foot of the index, built from nothing in Blender.
#
#   blender -b --factory-startup --python scripts/gear/build_gear.py [-- --fast]
#
# Every object is modelled here from boxes, cylinders and curves at its real
# size, so nothing is borrowed and nothing needs a credit. Lighting is baked
# into one texture per object (Cycles, combined), the site draws them unlit,
# and that is why the scene looks lit and still runs fast.
#
# One courtside bench with everything on it, under a tree. The tree's canopy
# is baked in plain white so the site can tint it for the season (gear/season.js).
#
# Writes public/casefile/gear/gear.glb (Draco, WebP textures) and still.webp,
# and keeps the .blend in build/gear/ to open by hand.

import math
import os
import sys

import bmesh
import bpy
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'public', 'casefile', 'gear')
WORK = os.path.join(ROOT, 'build', 'gear')

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
FAST = '--fast' in argv  # low samples, for checking a layout

BAKE_SAMPLES = 24 if FAST else 384
STILL_SAMPLES = 16 if FAST else 256
ITEM_RES = 512 if FAST else 1024
GROUND_RES = 1024 if FAST else 2048
LEAF_RES = 256 if FAST else 512

# the site's palette, as linear values for Blender
def srgb(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c) + (1.0,)

INK = srgb('#0a0a0a')
GRAPHITE = srgb('#1d1d1f')
PAPER = srgb('#efefec')
WHITE = srgb('#f7f7f4')
SILVER = srgb('#d6d6d2')
GREEN = srgb('#00653a')
OPTIC = srgb('#dbe94a')
GLASS = srgb('#050507')

# ---- scene ------------------------------------------------------------------

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.view_settings.view_transform = 'Standard'
scene.view_settings.look = 'None'
scene.render.film_transparent = False

prefs = bpy.context.preferences.addons['cycles'].preferences
try:
    prefs.compute_device_type = 'METAL'
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = 'GPU'
except TypeError:
    scene.cycles.device = 'CPU'


def mat(name, color, rough=0.5, metal=0.0, emit=None, emit_strength=0.0, coat=0.0):
    m = bpy.data.materials.new(name)
    bsdf = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    if coat:
        bsdf.inputs['Coat Weight'].default_value = coat
    if emit:
        bsdf.inputs['Emission Color'].default_value = emit
        bsdf.inputs['Emission Strength'].default_value = emit_strength
    return m


M = {
    'ink': mat('ink', INK, 0.45),
    'graphite': mat('graphite', GRAPHITE, 0.35, 0.6),
    'silver': mat('silver', SILVER, 0.3, 0.8),
    'paper': mat('paper', PAPER, 0.9),
    'white': mat('white', WHITE, 0.55),
    'green': mat('green', GREEN, 0.55, coat=0.2),
    'felt': mat('felt', OPTIC, 1.0),
    'glass': mat('glass', GLASS, 0.06, coat=1.0),
    'rubber': mat('rubber', srgb('#141414'), 0.85),
    'screen': mat('screen', PAPER, 0.2, emit=PAPER, emit_strength=1.4),
    # the CORTIS lightstick: warm off-white body, a frosted tube lit from inside
    'greige': mat('greige', srgb('#b8b0a2'), 0.45),
    # darker than the body, so the lit core inside reads through it
    'acrylic': mat('acrylic', srgb('#8e9aa5'), 0.08, emit=srgb('#c9d6e2'), emit_strength=0.12, coat=1.0),
    'core': mat('core', WHITE, 0.3, emit=srgb('#f4f8ff'), emit_strength=1.6),
    'rec': mat('rec', srgb('#b3261e'), 0.4),
    'floor': mat('floor', srgb('#d4d4cf'), 0.95),
    'bark': mat('bark', srgb('#5b4535'), 0.9),
    # white on purpose: the bake keeps only light and shadow, the site adds the season
    'canopy': mat('canopy', srgb('#f2f2ee'), 1.0),
}


def active():
    return bpy.context.view_layer.objects.active


def select_only(objs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]


def finish(o, material, smooth=True):
    o.data.materials.clear()
    o.data.materials.append(M[material] if isinstance(material, str) else material)
    if smooth:
        for p in o.data.polygons:
            p.use_smooth = True
    return o


def rounded_box(name, size, loc=(0, 0, 0), corner=0.0, edge=0.0, material='ink', segs=8):
    """A box with rounded vertical corners (phones, laptops) and softened edges."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(size), verts=bm.verts)
    if corner:
        vertical = [e for e in bm.edges if abs((e.verts[0].co - e.verts[1].co).normalized().z) > 0.99]
        bmesh.ops.bevel(bm, geom=vertical, offset=corner, segments=segs, affect='EDGES', profile=0.5)
    if edge:
        bmesh.ops.bevel(bm, geom=list(bm.edges), offset=edge, segments=2, affect='EDGES', profile=0.5)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    o.location = loc
    return finish(o, material)


def cylinder(name, r, depth, loc=(0, 0, 0), rot=(0, 0, 0), material='ink', verts=40, bevel=0.0):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, vertices=verts, location=loc, rotation=rot)
    o = active()
    o.name = name
    if bevel:
        b = o.modifiers.new('bevel', 'BEVEL')
        b.width = bevel
        b.segments = 2
    finish(o, material)
    # cylinders read better with flat caps and smooth sides
    for p in o.data.polygons:
        p.use_smooth = len(p.vertices) == 4
    return o


def sphere(name, r, loc=(0, 0, 0), material='ink', seg=48, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=seg, ring_count=rings, location=loc)
    o = active()
    o.name = name
    return finish(o, material)


def tube(name, points, radius, material='ink', closed=False, res=6):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = radius
    cu.bevel_resolution = res
    cu.use_fill_caps = True
    sp = cu.splines.new('POLY')
    sp.points.add(len(points) - 1)
    for p, co in zip(sp.points, points):
        p.co = (*co, 1.0)
    sp.use_cyclic_u = closed
    o = bpy.data.objects.new(name, cu)
    bpy.context.collection.objects.link(o)
    select_only([o])
    bpy.ops.object.convert(target='MESH')
    o = active()
    return finish(o, material)


def join(parts, name):
    """Applies every modifier and merges the parts into one object called name,
    its origin at the centre of its bounds so it can turn in place."""
    for p in parts:
        select_only([p])
        for m in list(p.modifiers):
            bpy.ops.object.modifier_apply(modifier=m.name)
    select_only(parts)
    bpy.ops.object.join()
    o = active()
    o.name = name
    o.data.name = name
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    return o


def place(o, loc=(0, 0, 0), rot=(0, 0, 0)):
    """Puts the bottom of o's bounds at loc's z, centred on loc's x and y."""
    o.rotation_euler = [math.radians(a) for a in rot]
    bpy.context.view_layer.update()
    corners = [o.matrix_world @ Vector(c) for c in o.bound_box]
    lo = min(c.z for c in corners)
    cx = (min(c.x for c in corners) + max(c.x for c in corners)) / 2
    cy = (min(c.y for c in corners) + max(c.y for c in corners)) / 2
    o.location += Vector((loc[0] - cx, loc[1] - cy, loc[2] - lo))
    bpy.context.view_layer.update()
    return o


# ---- the gear, modelled at real size (metres), each at the origin -----------

def build_racket():
    a, b = 0.128, 0.162  # head half-width and half-length
    head_y = 0.685 - b - 0.012  # the head sits at the far end of a 685 mm frame
    ring = [(a * math.cos(t), head_y + b * math.sin(t), 0) for t in [i / 96 * math.tau for i in range(96)]]
    parts = [tube('frame', ring, 0.0105, 'ink', closed=True)]
    # the bumper guard over the top of the head
    bump = [(a * 1.03 * math.cos(t), head_y + b * 1.03 * math.sin(t), 0) for t in [math.radians(55 + i * 70 / 24) for i in range(25)]]
    parts.append(tube('bumper', bump, 0.0112, 'graphite'))
    # the throat: two arms from the head's foot down to the shaft
    for s in (-1, 1):
        parts.append(tube('throat', [(s * a * 0.55, head_y - b * 0.83, 0), (s * 0.03, 0.26, 0), (s * 0.012, 0.21, 0)], 0.0085, 'ink'))
    # handle: octagonal, white grip tape, a green butt cap
    parts.append(cylinder('handle', 0.0155, 0.2, loc=(0, 0.1, 0), rot=(math.pi / 2, 0, 0), material='white', verts=8, bevel=0.002))
    parts.append(cylinder('butt', 0.0172, 0.012, loc=(0, 0.004, 0), rot=(math.pi / 2, 0, 0), material='green', verts=8, bevel=0.002))
    parts.append(cylinder('collar', 0.0165, 0.016, loc=(0, 0.205, 0), rot=(math.pi / 2, 0, 0), material='green', verts=8))
    # strings: 16 mains, 19 crosses, clipped to the head
    for i in range(16):
        x = (i - 7.5) / 8.4 * a
        h = b * math.sqrt(max(0.0, 1 - (x / a) ** 2)) - 0.004
        parts.append(rounded_box('main', (0.0014, 2 * h, 0.0014), loc=(x, head_y, 0), material='white'))
    for i in range(19):
        y = (i - 9) / 10 * b
        w = a * math.sqrt(max(0.0, 1 - (y / b) ** 2)) - 0.004
        parts.append(rounded_box('cross', (2 * w, 0.0014, 0.0014), loc=(0, head_y + y, 0.0007), material='white'))
    return join(parts, 'racket')


def build_ball():
    r = 0.0335
    parts = [sphere('felt', r, material='felt')]
    # the seam: a closed curve on the sphere, x²+y²+z² = (p+q)² = 1
    p, q = 0.64, 0.36
    pts = []
    for i in range(160):
        t = i / 160 * math.tau
        x = p * math.cos(t) + q * math.cos(3 * t)
        y = p * math.sin(t) - q * math.sin(3 * t)
        z = 2 * math.sqrt(p * q) * math.sin(2 * t)
        pts.append((x * r * 1.003, y * r * 1.003, z * r * 1.003))
    parts.append(tube('seam', pts, 0.0011, 'white', closed=True, res=3))
    return join(parts, 'ball')


def build_iphone():
    # 17 Pro: 150 x 71.7 x 8.75 mm, lying face down to show the camera plateau
    w, h, d = 0.0717, 0.150, 0.0087
    parts = [rounded_box('body', (w, h, d), corner=0.0105, edge=0.0016, material='silver')]
    parts.append(rounded_box('screen', (w - 0.002, h - 0.002, 0.0006), loc=(0, 0, -d / 2 - 0.0001), corner=0.0097, material='glass'))
    # the full-width plateau across the top of the back
    plat_y = h / 2 - 0.0165
    parts.append(rounded_box('plateau', (w - 0.004, 0.027, 0.0016), loc=(0, plat_y, d / 2 + 0.0006), corner=0.006, edge=0.0005, material='silver'))
    for x, y in ((-0.022, plat_y + 0.006), (-0.022, plat_y - 0.0065), (-0.0095, plat_y)):
        parts.append(cylinder('ring', 0.0062, 0.0024, loc=(x, y, d / 2 + 0.0018), material='graphite', bevel=0.0006))
        parts.append(cylinder('lens', 0.0045, 0.0026, loc=(x, y, d / 2 + 0.0019), material='glass'))
    parts.append(cylinder('flash', 0.0025, 0.0018, loc=(0.02, plat_y + 0.006, d / 2 + 0.0016), material='paper'))
    # action button and volume on one side; power and camera control on the other
    for y, length in ((0.042, 0.007), (0.026, 0.012), (0.011, 0.012)):
        parts.append(rounded_box('button', (0.0014, length, 0.0032), loc=(-w / 2 - 0.0004, y, 0), edge=0.0005, material='silver'))
    parts.append(rounded_box('power', (0.0014, 0.018, 0.0032), loc=(w / 2 + 0.0004, 0.022, 0), edge=0.0005, material='silver'))
    parts.append(rounded_box('capture', (0.0008, 0.012, 0.0034), loc=(w / 2 + 0.0002, -0.02, 0), edge=0.0003, material='graphite'))
    return join(parts, 'iphone')


def build_macbook():
    # 14-inch: 312.6 x 221.2 mm, 15.5 mm closed; the lid open at 108 degrees
    w, dpt = 0.3126, 0.2212
    base_t, lid_t = 0.0085, 0.0062
    parts = [rounded_box('base', (w, dpt, base_t), loc=(0, 0, base_t / 2), corner=0.012, edge=0.0015, material='graphite')]
    # the keyboard: a short function row, then five full rows of caps
    kw, kgap = 0.0158, 0.0026
    for row in range(6):
        kh = 0.0085 if row == 0 else 0.0152
        y = dpt * 0.3 - (0 if row == 0 else 0.0085 + kgap + (row - 0.5) * (0.0152 + kgap))
        for col in range(14):
            x = (col - 6.5) * (kw + kgap)
            parts.append(rounded_box('key', (kw, kh, 0.0007), loc=(x, y, base_t + 0.0004), corner=0.002, material='ink'))
    parts.append(rounded_box('pad', (w * 0.4, dpt * 0.32, 0.0004), loc=(0, -dpt * 0.27, base_t + 0.0001), corner=0.006, material=mat('pad', srgb('#26262a'), 0.25, 0.6)))
    lid = rounded_box('lid', (w, dpt, lid_t), corner=0.012, edge=0.0015, material='graphite')
    screen = rounded_box('screen', (w - 0.012, dpt - 0.012, 0.0005), loc=(0, 0, -lid_t / 2 - 0.0002), corner=0.008, material='screen')
    bezel = rounded_box('bezel', (w - 0.006, dpt - 0.006, 0.0003), loc=(0, 0, -lid_t / 2 - 0.0001), corner=0.01, material='ink')
    notch = rounded_box('notch', (0.032, 0.0065, 0.0004), loc=(0, -dpt / 2 + 0.0085, -lid_t / 2 - 0.0005), corner=0.002, material='ink')
    # his name on the display, black on the site's paper
    bpy.ops.object.text_add(location=(0, 0.01, -lid_t / 2 - 0.0006), rotation=(math.pi, 0, 0))
    txt = active()
    txt.data.body = 'Matthew PARK'
    txt.data.align_x = 'CENTER'
    txt.data.align_y = 'CENTER'
    txt.data.size = 0.032
    txt.data.extrude = 0.0002
    select_only([txt])
    bpy.ops.object.convert(target='MESH')
    txt = finish(active(), 'ink', smooth=False)
    hinge = join([lid, bezel, screen, notch, txt], 'lidpart')
    # hinge the lid on the base's back edge
    hinge.location = (0, dpt / 2, base_t)
    bpy.context.view_layer.update()
    for v in hinge.data.vertices:
        v.co.y -= dpt / 2
    hinge.rotation_euler = (math.radians(-108), 0, 0)
    hinge.location = (0, dpt / 2, base_t + lid_t / 2)
    bpy.context.view_layer.update()
    select_only([hinge])
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    parts.append(hinge)
    return join(parts, 'macbook')


def build_journal():
    # an A5 hardback in court green with a black elastic and a pen
    w, h = 0.148, 0.21
    parts = [
        rounded_box('back', (w, h, 0.0022), loc=(0, 0, 0.0011), edge=0.0008, material='green'),
        rounded_box('front', (w, h, 0.0022), loc=(0, 0, 0.0151), edge=0.0008, material='green'),
        rounded_box('spine', (0.006, h, 0.016), loc=(-w / 2 + 0.002, 0, 0.0081), edge=0.002, material='green'),
        rounded_box('pages', (w - 0.006, h - 0.006, 0.0118), loc=(0.001, 0, 0.0081), edge=0.0006, material='paper'),
        rounded_box('elastic', (0.006, h + 0.0012, 0.0172), loc=(w / 2 - 0.018, 0, 0.0081), material='ink'),
        cylinder('pen', 0.0045, 0.138, loc=(0.012, 0, 0.021), rot=(math.pi / 2, 0, math.radians(8)), material='ink'),
        cylinder('cap', 0.0047, 0.03, loc=(0.0145, 0.06, 0.021), rot=(math.pi / 2, 0, math.radians(8)), material='felt'),
        # the ribbon marker hanging out of the pages
        rounded_box('ribbon', (0.006, 0.034, 0.0006), loc=(0.02, -h / 2 - 0.014, 0.003), material='felt'),
    ]
    return join(parts, 'journal')


def build_fx30():
    # FX30 body 129.7 x 77.8 x 84.5 mm, a short zoom, the XLR top handle
    bw, bh, bd = 0.1297, 0.0778, 0.0845 - 0.03
    parts = [rounded_box('body', (bw, bd, bh), loc=(0, 0, bh / 2), corner=0.006, edge=0.002, material='ink')]
    parts.append(rounded_box('grip', (0.032, 0.03, bh * 0.94), loc=(bw / 2 - 0.018, -bd / 2 - 0.012, bh * 0.48), corner=0.012, edge=0.003, material='rubber'))
    for i in range(5):  # heat-sink fins across the top
        parts.append(rounded_box('fin', (bw * 0.7, 0.003, 0.004), loc=(-0.006, -bd / 2 + 0.008 + i * 0.009, bh + 0.002), material='graphite'))
    # lens: mount ring, barrel, two rubber rings, front glass
    lens_z = bh * 0.5
    x = -0.012
    parts.append(cylinder('mount', 0.031, 0.006, loc=(x, -bd / 2 - 0.003, lens_z), rot=(math.pi / 2, 0, 0), material='silver'))
    parts.append(cylinder('barrel', 0.034, 0.09, loc=(x, -bd / 2 - 0.051, lens_z), rot=(math.pi / 2, 0, 0), material='ink', verts=48, bevel=0.002))
    for y in (-bd / 2 - 0.03, -bd / 2 - 0.07):
        parts.append(cylinder('zoom', 0.0355, 0.022, loc=(x, y, lens_z), rot=(math.pi / 2, 0, 0), material='rubber', verts=48))
    parts.append(cylinder('front', 0.026, 0.002, loc=(x, -bd / 2 - 0.0965, lens_z), rot=(math.pi / 2, 0, 0), material='glass', verts=48))
    # the handle: two posts and a bar, an XLR block at the front
    for px in (-0.04, 0.04):
        parts.append(rounded_box('post', (0.012, 0.016, 0.03), loc=(px, 0, bh + 0.015), edge=0.002, material='ink'))
    parts.append(rounded_box('bar', (0.11, 0.022, 0.014), loc=(0, 0, bh + 0.036), corner=0.006, edge=0.003, material='ink'))
    parts.append(rounded_box('xlr', (0.04, 0.03, 0.024), loc=(0.02, -0.022, bh + 0.036), corner=0.004, edge=0.002, material='graphite'))
    parts.append(rounded_box('lcd', (0.07, 0.004, 0.05), loc=(-0.01, bd / 2 + 0.002, bh * 0.5), corner=0.003, material='glass'))
    # top plate: the mode dial, the record button by the grip, a control wheel
    parts.append(cylinder('dial', 0.011, 0.007, loc=(bw / 2 - 0.024, 0.006, bh + 0.0035), material='graphite', verts=24, bevel=0.001))
    parts.append(cylinder('rec', 0.0042, 0.003, loc=(bw / 2 - 0.016, -bd / 2 + 0.004, bh + 0.0015), material='rec', verts=20))
    parts.append(cylinder('wheel', 0.012, 0.004, loc=(bw / 2 - 0.02, bd / 2 - 0.004, bh * 0.82), rot=(math.pi / 2, 0, 0), material='graphite', verts=24))
    # strap lugs, and the lens's name ring
    for sx in (-1, 1):
        parts.append(rounded_box('lug', (0.004, 0.01, 0.008), loc=(sx * (bw / 2 + 0.002), 0, bh - 0.01), edge=0.0012, material='silver'))
    parts.append(cylinder('namering', 0.0343, 0.003, loc=(x, -bd / 2 - 0.092, lens_z), rot=(math.pi / 2, 0, 0), material='graphite', verts=48))
    return join(parts, 'fx30')


def build_lightstick():
    # the CORTIS official lightstick (from his photo): a slim off-white stick,
    # a frosted tube in the middle lit from a core inside, a stepped cap.
    # No emblem: shapes only.
    r = 0.0185
    parts = [
        cylinder('base', r, 0.112, loc=(0, 0, 0.056), material='greige', verts=48, bevel=0.004),
        cylinder('seam', r + 0.0006, 0.0016, loc=(0, 0, 0.094), material='graphite', verts=48),
        cylinder('collar', r + 0.0004, 0.01, loc=(0, 0, 0.117), material='greige', verts=48, bevel=0.0015),
        cylinder('tube', r - 0.0012, 0.098, loc=(0, 0, 0.171), material='acrylic', verts=48),
        cylinder('core', 0.0092, 0.094, loc=(0, 0, 0.171), material='core', verts=24),
        cylinder('ring', r + 0.0003, 0.0014, loc=(0, 0, 0.1222), material='graphite', verts=48),
        cylinder('ring', r + 0.0003, 0.0014, loc=(0, 0, 0.2198), material='graphite', verts=48),
        cylinder('cap', r, 0.034, loc=(0, 0, 0.237), material='greige', verts=48, bevel=0.003),
        cylinder('top', 0.0108, 0.02, loc=(0, 0, 0.264), material='greige', verts=40, bevel=0.002),
        cylinder('tip', 0.0092, 0.004, loc=(0, 0, 0.276), material='greige', verts=40, bevel=0.0015),
    ]
    return join(parts, 'lightstick')


GEAR = {
    'racket': build_racket,
    'ball': build_ball,
    'iphone': build_iphone,
    'macbook': build_macbook,
    'journal': build_journal,
    'fx30': build_fx30,
    'lightstick': build_lightstick,
}

def build_tree():
    """A small tree: a tapering trunk, a few branches (bare in winter), and
    six canopy clusters, each its own object so the site can colour them."""
    parts = [cone('trunk', 0.11, 0.055, 1.75, (0, 0, 0.875), (0, 0, 0))]
    for z, tilt, turn, length in ((1.15, 42, 20, 0.8), (1.3, 38, 140, 0.72), (1.42, 46, 255, 0.7), (1.55, 30, 320, 0.6), (1.62, 34, 80, 0.55)):
        t, a = math.radians(tilt), math.radians(turn)
        d = Vector((math.sin(t) * math.cos(a), math.sin(t) * math.sin(a), math.cos(t)))
        mid = Vector((0, 0, z)) + d * length / 2
        parts.append(cone('branch', 0.045, 0.012, length, tuple(mid), tuple(d.to_track_quat('Z', 'Y').to_euler())))
    trunk = join(parts, 'trunk')

    canopies = []
    blobs = ((0, 0, 2.05, 0.6), (0.44, 0.12, 1.82, 0.44), (-0.42, -0.1, 1.86, 0.47), (0.14, -0.4, 1.95, 0.42), (-0.12, 0.42, 2.0, 0.45), (0.05, 0.02, 2.45, 0.4))
    tex = bpy.data.textures.new('leafy', 'CLOUDS')
    tex.noise_scale = 0.13
    for i, (x, y, z, r) in enumerate(blobs):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=r, location=(x, y, z))
        o = active()
        o.name = f'canopy_{i}'
        d = o.modifiers.new('leafy', 'DISPLACE')
        d.texture = tex
        d.strength = 0.16
        finish(o, 'canopy', smooth=False)  # faceted, like cut paper
        select_only([o])
        bpy.ops.object.modifier_apply(modifier='leafy')
        canopies.append(o)
    return trunk, canopies


def cone(name, r1, r2, depth, loc, rot):
    bpy.ops.mesh.primitive_cone_add(radius1=r1, radius2=r2, depth=depth, vertices=14, location=loc, rotation=rot)
    o = active()
    o.name = name
    finish(o, 'bark')
    for p in o.data.polygons:
        p.use_smooth = len(p.vertices) == 4
    return o


# ---- the bench -----------------------------------------------------

SEAT_Z = 0.45
TREE_AT = (-1.5, 0.6, 0.0)  # beside the bench's left end, a little behind
TREE_SCALE = 0.8


def build_bench():
    parts = []
    for i in range(4):
        y = -0.15 + i * 0.1
        parts.append(rounded_box('slat', (1.6, 0.088, 0.03), loc=(0, y, SEAT_Z - 0.015), edge=0.006, material='green'))
    for x in (-0.66, 0.66):
        for y in (-0.17, 0.17):
            parts.append(rounded_box('leg', (0.04, 0.04, SEAT_Z - 0.03), loc=(x, y, (SEAT_Z - 0.03) / 2), edge=0.004, material='white'))
        parts.append(rounded_box('rail', (0.04, 0.38, 0.04), loc=(x, 0, SEAT_Z - 0.05), edge=0.004, material='white'))
        parts.append(rounded_box('foot', (0.04, 0.38, 0.03), loc=(x, 0, 0.06), edge=0.004, material='white'))
    parts.append(rounded_box('stretcher', (1.32, 0.03, 0.03), loc=(0, 0, 0.06), edge=0.004, material='white'))
    return join(parts, 'bench')


def layout_a():
    bench = place(build_bench(), (0, 0, 0))
    g = {k: f() for k, f in GEAR.items()}
    place(g['macbook'], (-0.34, 0.02, SEAT_Z), (0, 0, 8))
    place(g['journal'], (0.06, -0.04, SEAT_Z), (0, 0, -14))
    place(g['iphone'], (0.27, -0.08, SEAT_Z), (0, 180, 21))
    place(g['fx30'], (0.5, 0.06, SEAT_Z), (0, 0, -32))
    place(g['lightstick'], (-0.02, 0.13, SEAT_Z), (0, 0, 0))
    place(g['racket'], (0.7, 0.0, 0.0), (74, 0, -4))  # leaning on the bench's front edge
    g['racket'].location.y = -0.3
    place(g['ball'], (0.5, -0.46, 0.0))
    floor = plane('floor', 40.0, 'floor')
    trunk, canopies = build_tree()
    for o in [trunk, *canopies]:
        o.location = o.location * TREE_SCALE + Vector(TREE_AT)
        o.scale = (TREE_SCALE,) * 3

    area('key', (-1.4, -1.6, 2.4), (0, 0.3, 0.45), 2.2, 120)
    area('fill', (1.8, -1.0, 1.4), (0, 0.2, 0.4), 2.5, 35)
    area('rim', (0.6, 1.8, 1.6), (0, 0.0, 0.45), 1.6, 70)
    world(PAPER, 0.85)
    cam = camera('view', (1.3, -3.95, 2.3), (-0.34, 0.0, 0.74), lens=40)
    return list(g.values()), [bench, floor], [cam], [(trunk, ITEM_RES)] + [(c, LEAF_RES) for c in canopies]


# ---- lights, camera, ground ---------------------------------------------------------

def plane(name, size, material):
    bpy.ops.mesh.primitive_plane_add(size=size, location=(0, 0, 0))
    o = active()
    o.name = name
    return finish(o, material, smooth=False)


def aim(o, target):
    d = Vector(target) - o.location
    o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


def area(name, loc, target, size, power):
    li = bpy.data.lights.new(name, 'AREA')
    li.size = size
    li.energy = power
    o = bpy.data.objects.new(name, li)
    bpy.context.collection.objects.link(o)
    o.location = loc
    aim(o, target)
    return o


def world(color, strength):
    w = bpy.data.worlds.new('world')
    scene.world = w
    bg = next(n for n in w.node_tree.nodes if n.type == 'BACKGROUND')
    bg.inputs['Color'].default_value = color
    bg.inputs['Strength'].default_value = strength


def camera(name, loc, target, lens):
    c = bpy.data.cameras.new(name)
    c.lens = lens
    c.clip_start = 0.02
    c.clip_end = 60
    o = bpy.data.objects.new(name, c)
    bpy.context.collection.objects.link(o)
    o.location = loc
    aim(o, target)
    scene.camera = o
    return o


# ---- bake ---------------------------------------------------------------------------

def bake(o, res):
    """Bakes everything that lights o into one texture on a fresh UV map, then
    gives o a single material that just shows it."""
    select_only([o])
    # unique materials, so an image node added for this bake stays this object's
    for i, slot in enumerate(o.material_slots):
        if slot.material:
            o.material_slots[i].material = slot.material.copy()
    while o.data.uv_layers:
        o.data.uv_layers.remove(o.data.uv_layers[0])
    o.data.uv_layers.new(name='bake')
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.004)
    bpy.ops.object.mode_set(mode='OBJECT')

    img = bpy.data.images.new(f'{o.name}_bake', res, res, float_buffer=True)
    for slot in o.material_slots:
        nt = slot.material.node_tree
        n = nt.nodes.new('ShaderNodeTexImage')
        n.image = img
        nt.nodes.active = n
    scene.cycles.samples = BAKE_SAMPLES
    bpy.ops.object.bake(type='COMBINED', margin=6, use_clear=True)

    path = os.path.join(WORK, f'{o.name}.png')
    img.filepath_raw = path
    img.file_format = 'PNG'
    img.save_render(path)
    flat = bpy.data.images.load(path)
    flat.name = f'{o.name}'

    m = bpy.data.materials.new(f'baked_{o.name}')
    nt = m.node_tree
    bsdf = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Roughness'].default_value = 1.0
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = flat
    nt.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    o.data.materials.clear()
    o.data.materials.append(m)


def render_still(path, w, h):
    scene.render.resolution_x = w
    scene.render.resolution_y = h
    scene.render.resolution_percentage = 100
    scene.cycles.samples = STILL_SAMPLES
    scene.cycles.use_denoising = True
    scene.render.image_settings.file_format = 'WEBP'
    scene.render.image_settings.quality = 82
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(WORK, exist_ok=True)
    items, ground, cams, extras = layout_a()
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(WORK, 'gear-lit.blend'))

    # the still is the real render, before the materials are swapped for bakes
    render_still(os.path.join(OUT, 'still.webp'), 1600, 1000)

    for o in items:
        bake(o, ITEM_RES)
    for o in ground:
        bake(o, GROUND_RES)
    # the trunk bakes with the canopy out of the way: in winter the canopy is
    # hidden on the site, and its shade would leave the branches black
    canopies = [o for o, _ in extras if o.name.startswith('canopy_')]
    for c in canopies:
        c.hide_render = True
    for o, res in extras:
        if o not in canopies:
            bake(o, res)
    for c in canopies:
        c.hide_render = False
    for o in canopies:
        bake(o, LEAF_RES)

    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(WORK, 'gear.blend'))
    select_only(items + ground + [o for o, _ in extras] + cams)
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(OUT, 'gear.glb'),
        export_format='GLB',
        use_selection=True,
        export_cameras=True,
        export_lights=False,
        export_apply=True,
        export_image_format='WEBP',
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=7,
    )
    print('GEAR_DONE')


main()
