/* Licensed to the public under the Apache License 2.0. */

'use strict';
'require baseclass';

return baseclass.extend({
	title: _('UPS'),

	rrdargs: function(graph, host, plugin, plugin_instance, dtype) {
		var definitions = [];
		var instances;

		function find_instances(dtype, wanted) {
			var matching = graph.dataInstances(host, plugin, plugin_instance, dtype).filter(function(instance) {
				return wanted.indexOf(instance) > -1;
			});

			return matching.length ? { [dtype]: matching } : null;
		}

		if ((instances = find_instances('voltage', [ 'input', 'output' ])) != null) {
			definitions.push({
				title: "%H: AC voltages on UPS \"%pi\"",
				vlabel: "V",
				number_format: "%5.1lfV",
				data: {
					instances: instances,
					options: {
						voltage_output : { color: "00e000", title: "Output voltage", noarea: true, overlay: true },
						voltage_input  : { color: "ffb000", title: "Input voltage", noarea: true, overlay: true }
					}
				}
			});
		}

		if ((instances = find_instances('voltage', [ 'battery' ])) != null) {
			definitions.push({
				title: "%H: Battery voltage on UPS \"%pi\"",
				vlabel: "V",
				number_format: "%5.1lfV",
				data: {
					instances: instances,
					options: {
						voltage: { color: "0000ff", title: "Battery voltage", noarea: true, overlay: true }
					}
				}
			});
		}

		if ((instances = find_instances('current', [ 'battery', 'output' ])) != null) {
			definitions.push({
				title: "%H: Current on UPS \"%pi\"",
				vlabel: "A",
				number_format: "%5.3lfA",
				data: {
					instances: instances,
					options: {
						current_output : { color: "00e000", title: "Output current", noarea: true, overlay: true },
						current_battery: { color: "0000ff", title: "Battery current", noarea: true, overlay: true }
					}
				}
			});
		}

		if ((instances = find_instances('percent', [ 'charge', 'load' ])) != null) {
			definitions.push({
				title: "%H: Battery charge/load on UPS \"%pi\"",
				vlabel: "Percent",
				y_min: "0",
				y_max: "100",
				number_format: "%5.1lf%%",
				data: {
					instances: instances,
					options: {
						percent_charge: { color: "00ff00", title: "Charge level", noarea: true, overlay: true },
						percent_load: { color: "ff0000", title: "Load", noarea: true, overlay: true }
					}
				}
			});
		}

		if ((instances = find_instances('temperature', [ 'battery' ])) != null) {
			/* Note: This is in ISO8859-1 for rrdtool. Welcome to the 20th century. */
			definitions.push({
				title: "%H: Battery temperature on UPS \"%pi\"",
				vlabel: "\u00b0C",
				number_format: "%5.1lf\u00b0C",
				data: {
					instances: instances,
					options: {
						temperature_battery: { color: "ffb000", title: "Battery temperature", noarea: true }
					}
				}
			});
		}

		if ((instances = find_instances('timeleft', [ 'battery' ])) != null) {
			definitions.push({
				title: "%H: Time left on UPS \"%pi\"",
				vlabel: "Minutes",
				number_format: "%.1lfm",
				data: {
					instances: instances,
					options: {
						timeleft_battery: { color: "0000ff", title: "Time left", transform_rpn: "60,/", noarea: true }
					}
				}
			});
		}

		if ((instances = find_instances('power', [ 'watt-ups' ])) != null) {
			definitions.push({
				title: "%H: Power on UPS \"%pi\"",
				vlabel: "Watt",
				number_format: "%5.1lf%%",
				data: {
					instances: instances,
					options: {
						['power_watt-ups']: { color: "00ff00", title: "Power level (Watt)"  }
					}
				}
			});
		}

		if ((instances = find_instances('power', [ 'ups' ])) != null) {
			definitions.push({
				title: "%H: Power on UPS \"%pi\"",
				vlabel: "VA",
				number_format: "%5.1lf%%",
				data: {
					instances: instances,
					options: {
						power_ups: { color: "00ff00", title: "Power level (VA)"  }
					}
				}
			});
		}

		if ((instances = find_instances('frequency', [ 'input', 'output' ])) != null) {
			definitions.push({
				title: "%H: Frequencies on UPS \"%pi\"",
				vlabel: "Hz",
				number_format: "%5.1lfHz",
				data: {
					instances: instances,
					options: {
						frequency_output : { color: "00e000", title: "Output frequency", noarea: true, overlay: true },
						frequency_input  : { color: "ffb000", title: "Input frequency", noarea: true, overlay: true }
					}
				}
			});
		}

		return definitions;
	}
});
