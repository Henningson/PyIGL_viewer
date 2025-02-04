
#version 330

in vec4 outNormal;
in vec4 worldPosition;
in vec3 transformedLightDirection;

uniform vec3 cameraPosition;

uniform vec3 lightIntensity;
uniform vec3 ambientLighting;

uniform vec2 minmax;

uniform vec3 k_specular;
uniform vec3 k_ambient;
uniform float shininess;

out vec4 outputColor;

vec3 color_map(float t) {
    const vec3 c0 = vec3(0.0002189403691192265, 0.001651004631001012, -0.01948089843709184);
    const vec3 c1 = vec3(0.1065134194856116, 0.5639564367884091, 3.932712388889277);
    const vec3 c2 = vec3(11.60249308247187, -3.972853965665698, -15.9423941062914);
    const vec3 c3 = vec3(-41.70399613139459, 17.43639888205313, 44.35414519872813);
    const vec3 c4 = vec3(77.162935699427, -33.40235894210092, -81.80730925738993);
    const vec3 c5 = vec3(-71.31942824499214, 32.62606426397723, 73.20951985803202);
    const vec3 c6 = vec3(25.13112622477341, -12.24266895238567, -23.07032500287172);

    return c0+t*(c1+t*(c2+t*(c3+t*(c4+t*(c5+t*c6)))));
}

void main() {
    vec3 normal = outNormal.xyz;

    vec3 cameraDirection = normalize(cameraPosition - worldPosition.xyz);
    float dotCamera = dot(normal, cameraDirection);
    if (dotCamera < 0) {
        normal = -normal;
    }
    float dotNormal = dot(normal, transformedLightDirection);
    vec3 reflectedRay = normalize(2.0 * dotNormal * normal - transformedLightDirection);

    float reflectedFactor = max(0.0, dot(cameraDirection, reflectedRay));
    
    float normalizedY = (worldPosition.y - minmax[0])/(minmax[1] - minmax[0]);
    vec3 ambientComponent = k_ambient * ambientLighting;
    vec3 diffuseComponent = color_map(normalizedY) * dotNormal * lightIntensity;
    vec3 specularComponent = k_specular * pow(reflectedFactor, shininess) * lightIntensity;

    outputColor = vec4(ambientComponent + diffuseComponent + specularComponent, 1.0f);
}
